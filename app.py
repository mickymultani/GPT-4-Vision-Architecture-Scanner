from flask import Flask, render_template, request, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import webbrowser
from threading import Timer
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("The OPENAI_API_KEY environment variable is not set.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload_image', methods=['POST'])
def upload_image():
    image_data = request.json.get('image_data')
    base64_image = image_data.split(",")[1]  # Assuming the image data is sent as a base64 data URL

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Please provide a detailed, organized, and logical explanation of the provided system architecture diagram."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 600
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=payload,
        stream=True  # Set stream to True
    )

    # Check response status before streaming
    if response.status_code != 200:
        return Response(response.text, status=response.status_code, content_type='text/plain')

    def generate():
        for chunk in response.iter_content(chunk_size=4096):  # Use a sensible chunk size
            if chunk:  # filter out keep-alive new chunks
                yield chunk.decode('utf-8')  # Decode bytes to string

    # Stream the response with the correct content type
    return Response(stream_with_context(generate()), content_type='application/json')


def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        Timer(1, open_browser).start()
    app.run(debug=True)

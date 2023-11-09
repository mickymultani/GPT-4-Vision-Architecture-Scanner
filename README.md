# GPT-4 Vision Architecture Scanner

GPT-4 Vision Architecture Scanner is a web application built with Flask and OpenAI's GPT-4 Vision model, designed to analyze system architecture diagrams and provide interactive insights.

![System Architecture](system-architecture.gif)

## Features

- Upload and analyze system architecture diagrams.
- Integration with OpenAI's GPT-4 Vision for detailed insights into architecture components.
- Simple and easy setup with minimal configuration required.
- Supports image uploads in multiple formats.
- Responses are formatted with neat markdown.

## Installation

To run GPT-4 Vision Architecture Scanner on your local machine, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your_username/GPT-4-Vision-Architecture-Scanner.git
   cd GPT-4-Vision-Architecture-Scanner
   ```

2. Create and activate a virtual environment:
   ```
   # For Windows
   python -m venv venv
   .\venv\Scripts\activate

   # For Unix or MacOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Set your OpenAI API key as an environment variable in a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Usage

Run the application:
   ```
   python app.py
   ```

The application will start a local server and automatically open the chat interface in your default web browser. GPT-4 Vision currently(as of Nov 8, 2023) supports PNG (.png), JPEG (.jpeg and .jpg), WEBP (.webp), and non-animated GIF (.gif).

## Contributing

Contributions are welcome! If you have suggestions or contributions to the code, please follow the standard GitHub pull request process to propose your changes.

## License

This project is licensed under the MIT License.

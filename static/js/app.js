// Ensure marked is loaded in the global scope
if (typeof marked !== 'function') {
    console.error('Marked library is not loaded!');
}

async function sendChat() {
    let userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return; // Don't send empty messages

    // Add user's message to the chat area
    appendMessage(userInput, 'user-message');

    // Clear input after sending
    document.getElementById("userInput").value = '';

    try {
        // Start the POST request to send the message
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        let reader = response.body.getReader();
        let decoder = new TextDecoder();

        // Create a container for the bot's message
        let botMessageContainer = createMessageContainer('bot-message');

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            let chunk = decoder.decode(value, { stream: true });
            // Convert Markdown to HTML using marked.parse
            chunk = marked.parse(chunk);
            botMessageContainer.innerHTML += chunk;
        }
        // Scroll the bot's message container into view
        botMessageContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function sendImage() {
    let imageInput = document.getElementById('imageInput');
    if (imageInput.files.length === 0) return; // Don't send if no file is selected

    let file = imageInput.files[0];
    let reader = new FileReader();
    reader.onloadend = async function() {
        let base64Image = reader.result;

        // Append the image with scanning effect
        let imageHtml = `<div class="image-message scanning"><img src="${base64Image}" alt="User Image" style="max-width: 100%; height: auto;"></div>`;
        appendMessage(imageHtml, 'user-message');

        // Get the last message container that has the scanning effect
        let scanningContainer = document.querySelector('.image-message.scanning');

        try {
            // Start the POST request to send the image
            const response = await fetch('/upload_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_data: base64Image })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json(); // Parse the JSON response
            const assistantMessageContent = responseData.choices[0].message.content; // Extract the message content
            // Convert Markdown to HTML using marked.parse
            const formattedMessage = marked.parse(assistantMessageContent);
            appendMessage(formattedMessage, 'bot-message'); // Add formatted response to the chat area

            // Stop the scanning animation after the response is received
            if (scanningContainer) {
                scanningContainer.classList.remove('scanning');
            }

        } catch (error) {
            console.error('Error:', error);

            // Stop the scanning animation in case of error as well
            if (scanningContainer) {
                scanningContainer.classList.remove('scanning');
            }
        }
    };
    reader.readAsDataURL(file); // Read the file as DataURL (base64)
}

function appendMessage(content, className) {
    let messageContainer = createMessageContainer(className);

    // If the content is an image, add scanning effect
    if (content.includes('<img')) {
        messageContainer.innerHTML = content;
        messageContainer.firstChild.classList.add('scanning');
    } else {
        // Convert Markdown to HTML
        messageContainer.innerHTML = marked.parse(content);
    }

    document.getElementById('chatArea').appendChild(messageContainer);
    messageContainer.scrollIntoView({ behavior: 'smooth' });
}

function createMessageContainer(className) {
    let div = document.createElement('div');
    div.classList.add('message', className);
    return div;
}

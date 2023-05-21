// Get the chat form and message list
const chatForm = document.getElementById('chatForm');
const messageList = document.getElementById('messageList');

// Handle form submission
chatForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the user's input message
    const userInput = document.getElementById('messageInput').value;

    // Create a new list item for the user's message
    const userMessageItem = document.createElement('li');
    userMessageItem.className = 'list-group-item';
    userMessageItem.textContent = userInput;

    // Append the user's message to the message list
    messageList.appendChild(userMessageItem);

    // Define the URL of the Flask server API
    // Deploy API
    const apiUrl = 'https://cool-elbz.onrender.com/chatbot';

    // Use your local host address
    // const apiUrl = 'http://127.0.0.1:5501/chatbot';


    // Create the request payload
    const payload = {
        query: userInput
    };

    // Configure the fetch request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': '*'
        },
        body: JSON.stringify(payload)
    };

    // Send the fetch request
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
            // Handle the chatbot's response
            const chatbotResponse = data.response;
            console.log('Chatbot response:', chatbotResponse);

            // Simulate chatbot reply (replace with your chatbot logic)

            // Create a new list item for the chatbot's reply
            const chatbotReplyItem = document.createElement('li');
            chatbotReplyItem.className = 'list-group-item';
            chatbotReplyItem.textContent = chatbotResponse;

            // Append the chatbot's reply to the message list
            messageList.appendChild(chatbotReplyItem);

            // Clear the input field
            document.getElementById('messageInput').value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
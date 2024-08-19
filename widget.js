const Widget = {

    init: function () {
        // Create the widget button
        const widgetButton = document.createElement('div');
        widgetButton.classList.add('chatbot-button');
        widgetButton.id = 'chatbot-button';

        const widgetButtonBtn = document.createElement('button');
        widgetButtonBtn.textContent = 'Contact Us';

        widgetButton.appendChild(widgetButtonBtn);
        document.body.appendChild(widgetButton);

        // Add event listener to the widget button
        widgetButton.addEventListener('click', this.openChatWindow);
    },

    openChatWindow: async function () {
        const isWindowOpen = document.querySelector('.chat-window');
        if (isWindowOpen) {
            isWindowOpen.remove();
            return;
        }

        const chatWindow = document.createElement('div');
        chatWindow.classList.add('chat-window');
        chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="header-top">
                    <div class="exit-button">
                        <span>X</span>
                    </div>
                </div>
            </div>
            <div class="chat-body" id="chat-body">
                <div id="chat-messages">
                    <!-- Chat messages go here -->
                </div>
            </div>
            <div class="chat-footer">
                <div class="send-message-input-wrapper">
                    <input id="message-input" type="text" placeholder="Type your message..." class="send-message-input"/>
                    <div id="send-button" style="margin-right:5px;">
                        <img src="http://localhost:3030/send-btn?api_key=api_key1"/>
                    </div>
                </div>              
            </div>
        `;

        document.body.appendChild(chatWindow);

        const sendButton = chatWindow.querySelector('#send-button');
        sendButton.addEventListener('click', Widget.sendMessage);

        fetch('http://localhost:3030/new-chat', {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem('conversationID', res.response)
            })
            .catch(err => {
                console.log(err)
            });

        const exitButton = chatWindow.querySelector('.exit-button');
        exitButton.addEventListener('click', () => {
            const widgetButton = document.getElementById('chatbot-button');
            widgetButton.style.display = 'unset';
            Widget.openChatWindow();
        });

    },

    appendMessage: function (type, name, message) {

        const chatMessages = document.getElementById('chat-messages');
        const messageContainer = document.createElement('div');
        const profilePic = document.createElement('img');

        const currentDateTime = new Date().toLocaleString();

        if (type === 'user') {
            profilePic.src = 'http://localhost:3030/user-icon?api_key=api_key1'; // Replace with the actual path to the user's profile picture
            profilePic.classList.add('user-profile-pic');
            messageContainer.classList.add('user-message-container');
        } else if (type === 'server') {
            profilePic.src = 'http://localhost:3030/ai-icon?api_key=api_key1'; // Replace with the actual path to the server's profile picture
            profilePic.classList.add('server-profile-pic');
            messageContainer.classList.add('server-response-container');
        }

        const nameElement = document.createElement('div');
        nameElement.textContent = name;
        nameElement.classList.add('message-name');

        const messageElement = document.createElement('div');
        messageElement.classList.add(type === 'user' ? 'user-message' : 'server-response');

        const timestampElement = document.createElement('div');
        timestampElement.textContent = currentDateTime;
        timestampElement.classList.add('message-timestamp');
        timestampElement.classList.add(type === 'user' ? 'user-timestamp' : 'server-timestamp');

        if (type === 'user') {
            messageContainer.appendChild(messageElement);
            messageContainer.appendChild(profilePic);
        } else {
            messageContainer.appendChild(profilePic);
            messageContainer.appendChild(messageElement);
        }

        messageElement.insertBefore(nameElement, messageElement.firstChild);

        if (message) {
            const textElement = document.createElement('div');
            textElement.textContent = message;
            messageElement.appendChild(textElement);
        }

        messageElement.appendChild(timestampElement);
        chatMessages.appendChild(messageContainer);
    },

    sendMessage: function () {
        // Get the message from the input field
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();

        if (message === '') {
            return; // Don't send empty messages
        }

        // Display the user message in the chat area
        Widget.appendMessage('user', 'User', message);

        // Clear the input field
        messageInput.value = '';

        // Spinner
        const spinnerElement = document.createElement('div');
        spinnerElement.textContent = ".";
        spinnerElement.classList.add('spinner');
        spinnerElement.classList.add('server-response');
        document.getElementById('chat-messages').appendChild(spinnerElement);
        let dots = 1;
        const updateSpinner = () => {
            spinnerElement.textContent = '.'.repeat(dots);
            dots = dots % 5 + 1;
        };
        const spinnerInterval = setInterval(updateSpinner, 800);

        const sendButton = document.getElementById('send-button');
        sendButton.classList.add('disabled');
        sendButton.classList.remove('enabled');

        // Send the message to the server (replace with your server endpoint)
        fetch('http://localhost:3030/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Conversation-ID': localStorage.getItem('conversationID'),
            },
            body: JSON.stringify({ message: message })
        })
            .then(response => response.json())
            .then(data => {

                sendButton.classList.remove('disabled');
                sendButton.classList.add('enabled');

                spinnerElement.remove();
                clearInterval(spinnerInterval);

                if (data.error) {
                    Widget.appendMessage('error', 'Error', 'Error sending message. Please try again.');
                } else {
                    Widget.appendMessage('server', 'AI', data.response);
                }

                const chatBody = document.getElementById('chat-body');
                chatBody.scrollTop = chatBody.scrollHeight;
            })
            .catch(error => {
                console.error('Error sending message:', error);
                spinnerElement.remove();
                clearInterval(spinnerInterval);
                Widget.appendMessage('error', 'Error', 'Error sending message. Please try again.');
            });
    }

}

window.addEventListener('load', function () {
    Widget.init();
});
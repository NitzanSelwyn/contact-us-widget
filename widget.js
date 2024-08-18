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

        // fetch('http://localhost:3030/start', {
        //     method: 'GET'
        // })
        //     .then(res => res.json())
        //     .then(res => {

        //     })
        //     .catch(err => {
        //         console.log(err)
        //     });

        const exitButton = chatWindow.querySelector('.exit-button');
        exitButton.addEventListener('click', () => {
            const widgetButton = document.getElementById('chatbot-button');
            widgetButton.style.display = 'unset';
            Widget.openChatWindow();
        });

    }

}

window.addEventListener('load', function () {
    Widget.init();
});
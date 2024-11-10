function handleAPIError(error) {
    console.error('API Error:', error);
    let errorMessage = '抱歉，发生了错误';
    
    if (error.message.includes('API key')) {
        errorMessage = '请检查 API Key 是否正确设置';
    } else if (error.message.includes('network')) {
        errorMessage = '网络连接错误，请检查网络设置';
    }
    
    addMessage(errorMessage, 'system');
}

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 创建Moonshot API实例
    const moonshotAPI = new MoonshotAPI(CONFIG.API_KEY);
    let conversationHistory = [{
        role: 'system',
        content: CONFIG.SYSTEM_PROMPT
    }];

    // 添加初始欢迎消息
    addMessage('你好！我是基于 Moonshot AI 的智能助手。我可以：\n1. 回答问题\n2. 分析上传的文件\n3. 提供技术建议', 'ai');

    // 添加文件上传按钮
    const uploadButton = document.createElement('button');
    uploadButton.innerHTML = '<i class="fas fa-file-upload"></i>';
    uploadButton.className = 'chat-upload-btn';
    document.querySelector('.chat-input-container').insertBefore(
        uploadButton,
        sendButton
    );

    // 处理文件上传
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            showTypingIndicator();
            addMessage('正在上传文件...', 'system');

            // 上传文件
            const uploadResult = await moonshotAPI.uploadFile(file);
            
            // 获取文件内容
            const fileContent = await moonshotAPI.getFileContent(uploadResult.id);
            
            // 将文件内容添加到对话历史
            conversationHistory.push({
                role: 'system',
                content: fileContent
            });

            addMessage(`文件 ${file.name} 上传成功！`, 'system');
            removeTypingIndicator();
        } catch (error) {
            removeTypingIndicator();
            addMessage('文件上传失败: ' + error.message, 'system');
        }
    });

    // 发送消息
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        try {
            // 添加用户消息
            addMessage(message, 'user');
            chatInput.value = '';
            chatInput.style.height = 'auto';

            // 添加用户消息到对话历史
            conversationHistory.push({
                role: 'user',
                content: message
            });

            // 显示AI正在输入的动画
            showTypingIndicator();

            // 调用 Moonshot API
            const response = await moonshotAPI.chat(conversationHistory);
            
            if (response.choices && response.choices[0]) {
                const aiMessage = response.choices[0].message.content;
                
                // 添加AI回复到对话历史
                conversationHistory.push({
                    role: 'assistant',
                    content: aiMessage
                });

                removeTypingIndicator();
                addMessage(aiMessage, 'ai');
            } else {
                throw new Error('Invalid API response');
            }

        } catch (error) {
            handleAPIError(error);
            removeTypingIndicator();
        }
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = chatMessages.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // 自动调整输入框高度
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // 事件监听器
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}); 
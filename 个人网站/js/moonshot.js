class MoonshotAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.moonshot.cn/v1';
    }

    // 上传文件
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('purpose', 'file-extract');

        try {
            const response = await fetch(`${this.baseUrl}/files`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('文件上传失败');
            }

            return await response.json();
        } catch (error) {
            console.error('文件上传错误:', error);
            throw error;
        }
    }

    // 获取文件内容
    async getFileContent(fileId) {
        try {
            const response = await fetch(`${this.baseUrl}/files/${fileId}/content`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error('获取文件内容失败');
            }

            return await response.text();
        } catch (error) {
            console.error('获取文件内容错误:', error);
            throw error;
        }
    }

    // 与AI对话
    async chat(messages) {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'moonshot-v1-32k',
                    messages: messages,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                throw new Error('AI对话请求失败');
            }

            return await response.json();
        } catch (error) {
            console.error('AI对话错误:', error);
            throw error;
        }
    }
} 
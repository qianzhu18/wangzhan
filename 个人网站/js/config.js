const CONFIG = {
    API_KEY: 'sk-4JIw2BxMqEkOoRKwxK9VC7g5VnbNoBycTJ15sSplATfOgliB',
    API_URL: 'https://api.moonshot.cn/v1',
    MODEL: 'moonshot-v1-32k',
    SYSTEM_PROMPT: '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。'
};

// 添加错误处理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo);
    return false;
}; 
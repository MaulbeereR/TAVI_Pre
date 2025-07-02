/**
 * 发送聊天消息
 * 发送用户输入的消息并获取AI回复
 */
async function sendChatMessage() {
    const message = chatInputEl.value.trim();
    if (!message) return;
    
    // 清空输入框
    chatInputEl.value = '';
    
    // 添加用户消息到聊天窗口
    addMessageToChat('user', message);
    
    // 添加到聊天历史
    chatHistory.push({ role: 'user', content: message });
    
    try {
        // 显示加载状态
        const loadingMsgId = addMessageToChat('system', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
        
        // 调用API获取回复
        const response = await callGptApi(message);
        
        // 移除加载状态
        removeMessage(loadingMsgId);
        
        // 添加AI回复到聊天窗口
        addMessageToChat('system', response);
        
        // 添加回复到聊天历史
        chatHistory.push({ role: 'assistant', content: response });
    } catch (error) {
        console.error('获取AI回复时出错:', error);
        // 显示错误消息
        addMessageToChat('system', '抱歉，我遇到了一些问题，请稍后再试。');
    }
    
    // 滚动到底部
    scrollChatToBottom();
}

/**
 * 调用GPT API
 * 向Azure OpenAI服务发送请求并获取回复
 * @param {String} message - 用户消息
 * @returns {Promise<String>} AI回复内容
 */
async function callGptApi(message) {
    // 准备API请求参数
    const messages = [
        { role: 'system', content: '你是TAVI/TAVR（经导管主动脉瓣植入/置换术）领域的专家助手。你擅长回答有关TAVI/TAVR手术、主动脉瓣狭窄、瓣膜类型、手术结果和并发症等相关问题。请提供专业、准确、简洁的回答。' },
        ...chatHistory.slice(-10), // 保留最近10条消息作为上下文
    ];
    
    // 添加当前筛选条件的上下文信息
    const {context, ids} = getFilterContext();
    if (context) {
        messages.push({ role: 'system', content: context});
    }

    try {
        const endpoint = `${gptConfig.api_base}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': gptConfig.api_key
            },
            body: JSON.stringify({
                messages: messages,
                model: gptConfig.model,
                temperature: gptConfig.temperature,
                max_tokens: gptConfig.max_tokens
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败: ${response.status} ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API调用失败:', error);
        throw error;
    }
}

/**
 * 获取当前筛选条件的上下文
 * 构建当前筛选状态的文本描述
 * @returns {Object} 包含筛选上下文和ID的对象
 */
function getFilterContext() {
    // 如果没有应用筛选，则返回null
    if (filteredCases.length === taviCases.length) {
        return {context: null, ids: null};
    }
    
    // 收集筛选条件信息
    const gender = [];
    if (document.getElementById('gender-male').checked) gender.push('男性');
    if (document.getElementById('gender-female').checked) gender.push('女性');
    
    const outcomes = [];
    if (document.getElementById('paravalvular-leak').checked) outcomes.push('瓣周漏');
    if (document.getElementById('death').checked) outcomes.push('死亡');
    
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;
    
    const valveTypes = Array.from(document.querySelectorAll('.valve-type-checkboxes input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const valveDiameters = Array.from(document.querySelectorAll('.valve-diameter-checkboxes input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    const mgMin = document.getElementById('mean-gradient-min').value;
    const mgMax = document.getElementById('mean-gradient-max').value;
    
    // 构建上下文字符串
    let context = '当前筛选条件：';
    const conditions = [];
    
    if (gender.length > 0) conditions.push(`性别为${gender.join('或')}`);
    if (outcomes.length > 0) conditions.push(`术后结果包括${outcomes.join('或')}`);
    if (ageMin && ageMax) conditions.push(`年龄在${ageMin}到${ageMax}岁之间`);
    else if (ageMin) conditions.push(`年龄大于等于${ageMin}岁`);
    else if (ageMax) conditions.push(`年龄小于等于${ageMax}岁`);
    
    if (valveTypes.length > 0) conditions.push(`瓣膜类型为${valveTypes.join('、')}`);
    if (valveDiameters.length > 0) conditions.push(`瓣膜直径为${valveDiameters.join('、')}`);
    
    if (mgMin && mgMax) conditions.push(`术前平均跨瓣压差在${mgMin}到${mgMax} mmHg之间`);
    else if (mgMin) conditions.push(`术前平均跨瓣压差大于等于${mgMin} mmHg`);
    else if (mgMax) conditions.push(`术前平均跨瓣压差小于等于${mgMax} mmHg`);
    
    if (conditions.length === 0) {
        return {context: null, ids: null};
    }
    
    context += conditions.join('，') + '。';
    context += `筛选结果共有${filteredCases.length}个病例。`;

    const ids = filteredCases.map(item => item.id);

    // const limitedIds = ids.length > 10 ? ids.slice(0, 10) : ids;

    // context += `以下是筛选结果的标题和摘要：\n`;

    // for (let i = 0; i < limitedIds.length; i++) {
    //     const id = limitedIds[i];
    //     const case_info = taviCases.find(item => item.id === id);
    //     context += `病例${id}的摘要：${case_info.abstract}`;
    // }
    
    return {context, ids};
}

/**
 * 添加消息到聊天窗口
 * @param {String} role - 消息发送方角色（'user'或'system'）
 * @param {String} content - 消息内容
 * @returns {String} 消息元素ID
 */
function addMessageToChat(role, content) {
    const messageId = 'msg-' + Date.now();
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}`;
    messageEl.id = messageId;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    contentEl.innerHTML = formatMessage(content);
    
    messageEl.appendChild(contentEl);
    chatMessagesEl.appendChild(messageEl);
    
    // 滚动到底部
    scrollChatToBottom();
    
    return messageId;
}

/**
 * 移除消息
 * @param {String} messageId - 消息元素ID
 */
function removeMessage(messageId) {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
        messageEl.remove();
    }
}

/**
 * 格式化消息（支持简单的Markdown格式）
 * @param {String} message - 原始消息文本
 * @returns {String} 格式化后的HTML内容
 */
function formatMessage(message) {
    if (typeof message !== 'string') {
        return message;
    }
    
    // 转换换行符为<br>
    let formatted = message.replace(/\n/g, '<br>');
    
    // 转换Markdown风格的链接和加粗
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return formatted;
}

/**
 * 滚动聊天窗口到底部
 */
function scrollChatToBottom() {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

/**
 * 清空聊天历史
 */
function clearChatHistory() {
    // 清空聊天历史
    chatHistory = [];
    
    // 清空聊天窗口
    chatMessagesEl.innerHTML = '';
    
    // 添加欢迎消息
    addMessageToChat('system', '<p>你好！我是TAVI/TAVR智能助手，有任何关于TAVI/TAVR手术、瓣膜类型、病例分析的问题，请随时向我提问。</p>');
} 
---

## 🤖 智能问答助手 (RAGFlow)

为了提升用户体验和数据探索效率，本系统集成了一个基于RAGFlow的智能问答助手。用户可以通过自然语言与系统进行交互，查询知识库中的信息（例如：TAVI手术指南、术语解释、研究文献等）。

### 功能特性

- **自然语言交互**：无需复杂的筛选操作，直接提问即可。
- **知识驱动**：基于预先配置的RAGFlow知识库进行问答，保证答案的专业性和准确性。
- **便捷访问**：以悬浮窗的形式集成在页面右下角，随时可以唤出使用。

### 使用方法

1.  在系统页面的右下角，找到蓝色的机器人悬浮按钮 <i class="bi bi-robot"></i>。
2.  点击该按钮，即可展开智能问答聊天窗口。
3.  在输入框中输入您的问题（例如：“什么是瓣周漏？”，“STS评分过高的风险有哪些？”），然后按回车发送。
4.  助手将根据知识库内容给出回答。
5.  再次点击悬浮按钮（此时图标可能变为 <i class="bi bi-x"></i>），即可收起聊天窗口。

### 配置说明

智能问答助手通过 `<iframe>` 嵌入，其连接信息在前端代码中配置。如需修改或部署到新环境，请按以下步骤操作。

1.  **定位配置文件**：
    打开前端项目根目录下的 `index.html` 文件。

2.  **找到`<iframe>`标签**：
    在 `index.html` 文件中搜索 `ragflow-chat-container`，找到内部的 `<iframe>` 标签。

3.  **修改`src`属性**：
    `<iframe>` 的 `src` 属性决定了连接哪个RAGFlow服务。其URL结构如下：
    `http://<SERVER_IP_OR_DOMAIN>:<PORT>/chat/share?shared_id=<YOUR_SHARED_ID>&from=agent&auth=<YOUR_API_KEY>`

    请根据您的RAGFlow服务器信息，修改以下部分：
    -   `<SERVER_IP_OR_DOMAIN>`: 您的RAGFlow服务器的IP地址或域名。
        -   **开发环境示例**: `localhost` 或 `127.0.0.1`
        -   **生产环境示例**: `192.168.23.252` 或 `ragflow.yourcompany.com`
    -   `<PORT>`: RAGFlow服务运行的端口号（例如 `81`）。
    -   `<YOUR_SHARED_ID>`: 您在RAGFlow中创建并分享的知识库ID。
    -   `<YOUR_API_KEY>`: 用于访问该知识库的API Key。

    **配置示例**：
    ```html
    <!-- ... -->
    <div id="ragflow-chat-container">
        <iframe
            src="http://192.168.23.252:81/chat/share?shared_id=e8886c76483511f08c5c0242c0a80006&from=agent&auth=ragflow-FlOTc4NThjNDgzYTExZjBiNzgzMDI0Mm"
            style="width: 100%; height: 100%;"
            frameborder="0"
        ></iframe>
    </div>
    <!-- ... -->
    ```

### 注意事项

-   **网络访问**：请确保前端应用部署的环境能够访问到RAGFlow服务器的IP和端口。如有需要，请检查服务器的防火墙设置，确保相应端口是开放的。
-   **CORS策略**：如果您的前端应用和RAGFlow部署在不同的域下，可能需要配置RAGFlow服务器的CORS（跨域资源共享）策略，以允许被您的前端页面嵌入。
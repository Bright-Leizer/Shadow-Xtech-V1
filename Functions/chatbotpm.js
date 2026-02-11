const { getSettings, getSudoUsers } = require("../Database/config");
const fetch = require("node-fetch"); // Make sure fetch is imported

module.exports = async (client, m, store, chatbotpmSetting) => {
    try {
        // Ignore invalid or non-personal messages
        if (!m || !m.key || !m.message || !m.key.remoteJid.endsWith("@s.whatsapp.net") || m.key.fromMe) {
            return;
        }

        if (!chatbotpmSetting) return;

        const botNumber = await client.decodeJid(client.user.id);
        const sender = m.sender ? await client.decodeJid(m.sender) : null;
        const senderNumber = sender ? sender.split("@")[0] : null;

        if (!sender || !senderNumber) return;

        const sudoUsers = await getSudoUsers();
        if (sudoUsers.includes(senderNumber) || sender === botNumber) return;

        // Extract the message content
        const messageContent = (
            m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            m.message?.imageMessage?.caption ||
            m.message?.videoMessage?.caption ||
            ""
        ).trim();

        const { prefix } = await getSettings();
        if (!messageContent || messageContent.startsWith(prefix)) return;

        // Send message to chatbot API
        try {
            const encodedText = encodeURIComponent(messageContent);
            const apiUrl = `https://ab-chatgpt4o.abrahamdw882.workers.dev/?q=${encodedText}`;
            const response = await fetch(apiUrl, { timeout: 15000 });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== "success" || !data.data) {
                throw new Error("Invalid API response: missing status or data");
            }

            // Bold single-sentence reply
            await client.sendMessage(
                m.key.remoteJid,
                {
                    text: `*💬 Your AI Assistant says: ${data.data}*`
                },
                { quoted: m }
            );

        } catch (e) {
            console.error(`Shadow-Xtech-V1 ChatbotPM Error:`, e);

            // Bold single-sentence error message
            await client.sendMessage(
                m.key.remoteJid,
                {
                    text: `*⚠️ Oops, I couldn't process your message this time, please try again shortly!*`
                },
                { quoted: m }
            );
        }

    } catch (e) {
        console.error("Shadow-Xtech-V1 ChatbotPM Error:", e);
    }
};
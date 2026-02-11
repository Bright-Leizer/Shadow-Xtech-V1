const { getSettings } = require("../Database/config");

module.exports = async (client, m) => {
    try {
        if (!m?.message) return;
        if (m.key.fromMe) return;
        if (!m.isGroup) return;

        const settings = await getSettings();
        const antilinkMode = (settings.antilink || "off").toLowerCase();

        if (antilinkMode === "off") return;

        const isAdmin = m.isAdmin;
        const isBotAdmin = m.isBotAdmin;

        if (isAdmin) return;
        if (!isBotAdmin) return;

        let text = "";

        if (m.message.conversation) {
            text = m.message.conversation;
        } else if (m.message.extendedTextMessage?.text) {
            text = m.message.extendedTextMessage.text;
        } else if (m.message.imageMessage?.caption) {
            text = m.message.imageMessage.caption;
        } else if (m.message.videoMessage?.caption) {
            text = m.message.videoMessage.caption;
        } else if (m.message.documentMessage?.caption) {
            text = m.message.documentMessage.caption;
        }

        const urlRegex =
            /(https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+|t\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+|whatsapp\.com\/[^\s]+)/gi;

        if (!urlRegex.test(String(text).toLowerCase())) return;

        const username = `@${m.sender.split("@")[0]}`;

        // 🧹 Delete message
        await client.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.sender,
            },
        });

        // ⚠️ DELETE MODE
        if (antilinkMode !== "remove") {
            await client.sendMessage(m.chat, {
                text: `
*⎾⟪ ⚡ Shadow-Xtech-V1 | Enforcement ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
     *👤 User: ${username}*
     *🚫 Violation: Unauthorized Link*
     *🧹 Action: Message Deleted*
     *⚠️ Warning Issued*
   *⌬━━━━━━━━━━━━━━━━━⌬*
                `,
                mentions: [m.sender],
            });
        }

        // 🚪 REMOVE MODE
        if (antilinkMode === "remove") {
            try {
                await client.groupParticipantsUpdate(m.chat, [m.sender], "remove");

                await client.sendMessage(m.chat, {
                    text: `
*⎾⟪ ⚡ Shadow-Xtech-V1 | Enforcement ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
     *👤 User: ${username}*
     *🚫 Violation: Unauthorized Link*
     *🚪 Action: Removed from Group*
     *📘 Policy Enforcement Active*
   *⌬━━━━━━━━━━━━━━━━━⌬*
                    `,
                    mentions: [m.sender],
                });

            } catch {
                await client.sendMessage(m.chat, {
                    text: `
*⎾⟪ ⚡ Shadow-Xtech-V1 | System Error ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
     *❌ Removal Failed*
     *🔐 Bot lacks admin privileges*
     *⚙️ Please grant admin access*
   *⌬━━━━━━━━━━━━━━━━━⌬*
                    `,
                    mentions: [m.sender],
                });
            }
        }

    } catch (err) {
        // Silent fail — Shadow-Xtech remains calm ⚡
    }
};
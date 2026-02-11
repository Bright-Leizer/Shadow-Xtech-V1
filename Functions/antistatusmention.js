const { getSettings } = require("../Database/config"); 

module.exports = async (client, m) => {
    try {
        if (!m?.message) return;
        if (m.key.fromMe) return;
        if (!m.isGroup) return;

        const exemptGroup = "120363156185607326@g.us";
        if (m.chat === exemptGroup) return;

        const settings = await getSettings();
        const mode = settings.antistatusmention;

        if (!mode || mode === "off" || mode === "false") return;
        if (m.mtype !== 'groupStatusMentionMessage') return;

        const isAdmin = m.isAdmin;
        const isBotAdmin = m.isBotAdmin;

        const username = `@${m.sender.split("@")[0]}`;

        // 🛡️ ADMIN NOTICE
        if (isAdmin) {
            await client.sendMessage(m.chat, {
                text: `
*⎾⟪ ⚡ Shadow-Xtech-V1 | System... ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
     *👤 User: ${username}*
     *🛡️ Role: Group Admin*
     *✅ Status mention permitted*
     *📡 Admin override active*
   *⌬━━━━━━━━━━━━━━━━━⌬*
                `,
                mentions: [m.sender],
            });
            return;
        }

        if (!isBotAdmin) return;

        // 🧹 DELETE MESSAGE
        await client.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.sender,
            },
        });

        // ⚠️ DELETE MODE NOTICE
        if (mode === "delete" || mode === "true") {
            await client.sendMessage(m.chat, {
                text: `
*⎾⟪ ⚡ Shadow-Xtech-V1 | Enforcement ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
     *👤 User: ${username}*
     *🚫 Violation: Status Mention*
     *🧹 Action: Message Deleted*
     *⚠️ Warning Level: 1*
   *⌬━━━━━━━━━━━━━━━━━⌬*
                `,
                mentions: [m.sender],
            });
        }

        // 🚪 REMOVE MODE
        if (mode === "remove") {
            try {
                await client.groupParticipantsUpdate(m.chat, [m.sender], "remove");

                await client.sendMessage(m.chat, {
                    text: `
*⎾⟪ ⚡ Shadow-Xtech-V1 | Enforcement ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
     *👤 User: ${username}*
     *🚫 Violation: Status Mention*
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
     *❌ Action Failed*
     *🔐 Bot lacks admin privileges*
     *⚙️ Please grant admin access*
   *⌬━━━━━━━━━━━━━━━━━⌬*
                    `,
                });
            }
        }

    } catch (err) {
        console.error(err);
    }
};
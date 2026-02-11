const { getSettings, updateSetting } = require('../Database/config');
const { proto, getContentType, generateWAMessageID } = require('@whiskeysockets/baileys');

module.exports = async (context) => {
  const { client, m, args, settings, store } = context;

  const systemUI = (title, body) => {
    return `
*⎾⟪ ⚡ Shadow-Xtech-V1 | ${title} ⟫⏌*
   *⌬━━━━━━━━━━━━━━━━━⌬*
${body.split('\n').map(line => `     *${line}*`).join('\n')}
   *⌬━━━━━━━━━━━━━━━━━⌬*
`;
  };

  try {
    if (!m || !m.key || !m.key.remoteJid || !m.key.id) return;

    const myself = client.decodeJid(client.user.id);

    if (!m.key.fromMe) {
      return await m.reply(
        systemUI("Access Denied",
          "🔐 Restricted Command\n" +
          "⚠️ Only Bot Owner Can Toggle\n" +
          "📡 Security Layer Active"
        )
      );
    }

    const subCommand = args[0]?.toLowerCase();

    if (subCommand === 'status') {
      const isEnabled = settings.antidelete;

      return await m.reply(
        systemUI("System Status",
          "🔍 Anti-Delete Monitor\n\n" +
          `Status: ${isEnabled ? "✅ ENABLED" : "❌ DISABLED"}\n` +
          "Forward Target: Bot DM\n" +
          "Surveillance Mode: Passive"
        )
      );
    }

    const newState = !settings.antidelete;
    await updateSetting('antidelete', newState);

    await m.reply(
      systemUI("Configuration Updated",
        `Anti-Delete ${newState ? "✅ ENABLED" : "❌ DISABLED"}\n\n` +
        (newState
          ? "🛰️ Deleted messages will be intercepted\n🔒 Forwarded to secure DM channel"
          : "📴 Monitoring system offline\n🗑️ Deleted messages ignored")
      )
    );

  } catch (error) {
    console.error(`Error in antidelete: ${error}`);
  }

  // 🔍 Listener for deleted messages
  client.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.message || !msg.key) return;

    const settings = await getSettings();
    if (!settings.antidelete) return;

    if (msg.message?.protocolMessage?.type === 0) {
      const deletedP = msg.message.protocolMessage.key;
      const deletedM = await store.loadMessage(msg.key.remoteJid, deletedP.id);
      if (!deletedM) return;

      const botJid = client.decodeJid(client.user.id);
      const sender = client.decodeJid(deletedP.participant || deletedP.remoteJid);
      if (sender === botJid) return;

      try {
        deletedM.message = {
          [deletedM.mtype || "msg"]: deletedM?.msg
        };

        const M = proto.WebMessageInfo;
        const forwardedMsg = M.fromObject(M.toObject(deletedM));

        const isGroup = deletedP.remoteJid.endsWith('@g.us');
        const messageType = getContentType(deletedM.message);

        const captionBody =
          `👤 Sender: @${sender.split('@')[0]}\n` +
          `📍 Chat Type: ${isGroup ? "Group" : "Private"}\n` +
          `📦 Message Type: ${messageType}\n` +
          `⏳ Time: ${new Date(deletedM.messageTimestamp * 1000).toLocaleString("en-KE")}\n\n` +
          "⚠️ Deleted Message Captured";

        await client.sendMessage(botJid, {
          text: systemUI("Anti-Delete Detection", captionBody),
          mentions: [sender]
        });

        await client.relayMessage(botJid, forwardedMsg.message, {
          messageId: generateWAMessageID()
        });

      } catch (error) {
        await client.sendMessage(botJid, {
          text: systemUI("System Error",
            "❌ Forwarding Failed\n" +
            `Error: ${error.message}`
          )
        });
      }
    }
  });
};

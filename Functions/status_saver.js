module.exports = async (client, m, Owner, prefix) => {

    const textL = m.text.toLowerCase();
    const quotedMessage = m.msg?.contextInfo?.quotedMessage;

    // Case: user tries to save but didn't tag a status
    if (quotedMessage && textL.startsWith(prefix + "save") && !m.quoted.chat.includes("status@broadcast")) {
        return m.reply("*⚠️ Oops! You must tag a status media to save.*");
    }

    // Case: Owner saving status media
    if (Owner && quotedMessage && textL.startsWith(prefix + "save") && m.quoted.chat.includes("status@broadcast")) {

        // Save and resend image
        if (quotedMessage.imageMessage) {
            let imageCaption = quotedMessage.imageMessage.caption || "";
            let imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
            client.sendMessage(m.chat, { 
                image: { url: imageUrl }, 
                caption: `*✅ Status image saved successfully!*${imageCaption ? "\n\n" + imageCaption : ""}` 
            });
        }

        // Save and resend video
        if (quotedMessage.videoMessage) {
            let videoCaption = quotedMessage.videoMessage.caption || "";
            let videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
            client.sendMessage(m.chat, { 
                video: { url: videoUrl }, 
                caption: `*✅ Status video saved successfully!*${videoCaption ? "\n\n" + videoCaption : ""}` 
            });
        }
    }
};
module.exports = async (context, next) => {
    const { m, isBotAdmin } = context;

    if (!m.isGroup) {
        return m.reply(`⚡ **Whoops! This command only works in groups.** ⚡`);
    }

    if (!isBotAdmin) {
        return m.reply(`🤖 **I need admin powers to fetch the group link!**`);
    }

    await next(); // Proceed to the next function
};
const middleware = async (context, next) => {
    const { m, isBotAdmin, isAdmin } = context;

    if (!m.isGroup) return m.reply(`⚡ **This command only works in groups, lone wolf!** 🐺`);
    if (!isAdmin) return m.reply(`⚡ **You're not an admin, admin privileges are required!** 😤`);
    if (!isBotAdmin) return m.reply(`⚡ **I need admin rights to function—make me admin first!** 🫵`);

    await next();
};

module.exports = middleware;
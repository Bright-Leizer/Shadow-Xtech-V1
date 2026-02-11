const middleware = async (context, next) => {
    const { m, isBotAdmin, isAdmin } = context;

    if (!m.isGroup) {
        return m.reply(
            "*Hey! This command only works in groups 😎. Add me to a group and let's get things rolling!*"
        );
    }

    if (!isAdmin) {
        return m.reply(
            "*Hold up! Only group admins can run this command 🛡️. Ask an admin to grant you access and try again.*"
        );
    }

    if (!isBotAdmin) {
        return m.reply(
            "*I can't do that yet 🚀. I need admin privileges in this group... promote me and let's go!*"
        );
    }

    await next(); // Proceed to the main handler
};

module.exports = middleware;
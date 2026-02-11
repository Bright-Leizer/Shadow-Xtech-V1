module.exports = async (context, next) => {
    const { m, isBotAdmin } = context;

    if (!m.isGroup) {
        return m.reply(
            "*Oops! This command only works in groups 😎. Add me to a group and let's have some fun!*"
        );
    }

    if (!isBotAdmin) {
        return m.reply(
            "*I need admin powers to do that 🚀. Please promote me to admin and watch the magic happen!*"
        );
    }

    await next(); // Proceed to the next function (main handler)
};
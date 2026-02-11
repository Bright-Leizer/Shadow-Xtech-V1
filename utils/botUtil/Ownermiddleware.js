const Ownermiddleware = async (context, next) => {
    const { m, Owner } = context;

    if (!Owner) return m.reply(`⚡ **Access denied! Only the Owner can run this command.** 🚫`);

    await next();
};

module.exports = Ownermiddleware;

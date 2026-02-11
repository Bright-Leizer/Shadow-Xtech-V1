const Ownermiddleware = async (context, next) => {
    const { m, Owner } = context;

    if (!Owner) {
        return m.reply(
            "*🚫 Access Denied! Only the bot owner can run this command 😎. Your permissions aren't enough... contact the admin if needed!*"
        );
    }

    await next();
};

module.exports = Ownermiddleware;

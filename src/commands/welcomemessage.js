import discord from "../server/discord";
import logger from "../server/logger";
import wMsgCtrl from "../controllers/welcomemessage";

discord.onMemberJoin(member => {
    //Remplacer "Test" par le nom du rôle
    let role = member.guild.roles.find("name", "Test");
    member.addRole(role)
        .then(guildMember => {
            wMsgCtrl.getWelcomeMessage()
                .then(wMsg => {
                    let welcomeMsg = wMsg[wMsg.length - 1].message;
                    guildMember.send(welcomeMsg)
                        .then(message => {
                            logger.info(" Welcome Message sent");
                        }).catch(err => logger.error(err));

                })
                .catch(err => logger.error(err));
        })
        .catch(err => logger.error(err));
});


discord.onMessage(message => {
    if (message.content.startsWith("!wMsgEdit"))
        create(message);
    if (message.content.startsWith("!wMsgGet"))
        get();
});

function create(message) {
    if (message.content.length < 10) {
        discord.sendOnCmdChannel("Ecrit des règles avant de les remplacer ;)");
        return;
    }
    const newWMsg = message.content.replace("!wMsgEdit ", "");
    wMsgCtrl.saveWelcomeMessage(newWMsg)
        .then(wMsg => {
            logger.info("Create new welcome message:", wMsg);
            discord.sendOnCmdChannel("Nouveau message de bienvenue créé \n" + wMsg.message);
        })
        .catch(err => logger.error(err));
}

function get() {
    wMsgCtrl.getWelcomeMessage()
        .then(wMsg => {
            logger.info("Welcome Message: ", wMsg);

            discord.sendOnCmdChannel(wMsg[wMsg.length - 1].message);
        })
        .catch(err => logger.error(err));
}
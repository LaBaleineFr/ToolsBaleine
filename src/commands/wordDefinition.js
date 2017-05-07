import discord from "../server/discord";
import logger from "../server/logger";
import wordDefinitionCtrl from "../controllers/wordDefinition.js";

function isNil(obj) {
  return obj === undefined || obj === null;
}

const commands = {
  add: "helpAdd",
  delete: "helpDel",
  list: "helpList",
  get: "help",
};

discord.onMessageEverywhere(message => {
  if (message.content.startsWith("!help")) {
    const extract = /!(.\S+)\s*([\s\S]*)/m.exec(message.content);
    const command = extract[1];
    const params = extract.length > 1 ? extract[2] : "";
    if (command === commands.get) {
      getWordDefinition(message.channel, params);
    }
    else if (command === commands.list) {
      listWordDefinition(message.channel);
    }
  }
});

function getWordDefinition(channel, word) {
  wordDefinitionCtrl.getWordDefinition(word)
    .then(wordDefinition => {
      if (wordDefinition) {
        logger.info(`Definition for ${wordDefinition.word} sent:  ${wordDefinition.definition}`);
        discord.sendOn(channel, wordDefinition.definition);
      }
      else {
        discord.sendOn(channel, `Can't find a definition for the word ${word}`);
      }
    })
    .catch((err) => {
      logger.error(err);
    });
}

function listWordDefinition(channel) {
  wordDefinitionCtrl.listWordDefinition()
    .then(wordDefinitions => {
      const definitions = wordDefinitions.map((wordDefinition) => {
        return wordDefinition.word;
      });
      logger.info(definitions);
      discord.sendOn(channel, definitions);
    })
    .catch((err) => {
      logger.error(err);
      discord.sendOn(channel, "Ho shit, something goes wrong");
    });
}

/**
 * Extract command and params, and peform corresponding action.
 */
discord.onCmdChannelMessage(message => {
  if (message.content.startsWith("!help")) {
    // match !command params
    const extract = /!(.\S+)\s*([\s\S]*)/m.exec(message.content);
    const command = extract[1];
    const params = extract.length > 1 ? extract[2] : "";

    if (command === commands.add) {
      addWordDefinition(params);
    }
    else if (command === commands.delete) {
      deleteWordDefinition(params);
    }
  }
});

function addWordDefinition(message) {
  // match word :: definition
  const extract = /(.*)\s+::\s+(.*)/m.exec(message);
  if (!isNil(extract) && extract.length === 3) {
    const word = extract[1];
    const definition = extract[2];
    wordDefinitionCtrl.saveWordDefinition(word, definition)
      .then(wordDefinition => {
        const log = `Definition for ${wordDefinition.word} has been added: \n${wordDefinition.definition}`;
        logger.info(log);
        discord.sendOnCmdChannel(log);
      })
      .catch((err) => {
        logger.error(err);
        discord.sendOnCmdChannel(`The word ${word} already exists`);
      });
  }
  else {
    const log = "Can't add the definition. use the format word :: definition.";
    logger.info(log);
    discord.sendOnCmdChannel(log);
  }
}

function deleteWordDefinition(word) {
  wordDefinitionCtrl.deleteWordDefinition(word)
    .then(word => {
      const log = `Definition ${word} has been deleted`;
      logger.info(log);
      discord.sendOnCmdChannel(log);
    })
    .catch((err) => {
      logger.error(err);
      discord.sendOnCmdChannel(`Can't find and delete the word ${word}`);
    });
}
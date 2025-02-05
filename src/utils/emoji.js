const { request } = require("undici");

/*
    A class for application emojis.
    Made cause as far as i know, discordjs does not support
    application emojis yet.
*/

class EmojiHandler {
    constructor(client) {
      this.clientID = client.user.id;
      this.key = client.token;
    }
  
    async reloadList() {
      const { body } = await request(
        `https://discord.com/api/applications/${this.clientID}/emojis`,
        {
          headers: { Authorization: "Bot " + this.key },
        },
      );
  
      this.emojiList = await body.json();
    }
  
    async getEmojiData(emojiName) {
      if (this.emojiList == null) await this.reloadList();
  
      var result = this.emojiList.items.filter((obj) => {
        return obj.name === emojiName;
      });
  
      return result;
    }
  
    async getEmoji(emojiName) {
      var emojiString = "";
  
      if (this.emojiList == null) await this.reloadList();
  
      var result = this.emojiList.items.filter((obj) => {
        return obj.name === emojiName;
      });
  
      if (!result.length) return emojiString;
      var emoji = result[0];
      if (!emoji || !emoji.name || !emoji.id) return emojiString;
      return `<:${emoji.name}:${emoji.id}>`;
    }
  }
  
  module.exports = {
    EmojiHandler: EmojiHandler,
  };
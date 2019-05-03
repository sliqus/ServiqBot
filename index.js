const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./token.js');
const answer = require('./commands.js');

const prefix = "sq";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith(prefix)) {
    msg.reply(answer(msg));
  }
});

client.login(token);

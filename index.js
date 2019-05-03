const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./token.js');
const commands = require('./commands.js');

const prefix = "sq";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith(prefix)) {
    let splited = msg.content.split(" ")
    if(splited.length >= 3) {
      let params = splited.slice(2)
      msg.reply(commands[splited[1]](params.join(" ")))
      console.log(commands[splited[1]](params.join(" ")));
    }
  }
});

client.login(token);

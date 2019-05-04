const Discord = require('discord.js');
const client = new Discord.Client();

const tokens = require('./tokens/tokens.js'); // 토큰 가져오기

const answer = require('./commands.js');

const prefix = "sq";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);


});

client.on('message', msg => {
  if (msg.content.startsWith(prefix)) { //접두사로 시작한다면
    console.log(msg.channel.name);
    msg.reply(answer(msg)); //답변
  }
});

client.login(tokens("discord"));

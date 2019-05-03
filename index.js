const Discord = require('discord.js');
const client = new Discord.Client();
var admin = require("firebase-admin");

const tokens = require('./tokens/tokens.js'); // 토큰 가져오기
var serviceAccount = tokens("firebase");

const answer = require('./commands.js');

const prefix = "sq";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  admin.initializeApp({ // firebase 실행
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://serviqbot.firebaseio.com"
  });

  var db = admin.database(); // db
  var ref = db.ref("servers/"); // db 위치
  ref.once("value", function(data) {
    console.log(data.val()); // db위치에서 json정보 가져오기
  });
});

client.on('message', msg => {
  if (msg.content.startsWith(prefix)) { //접두사로 시작한다면
    msg.reply(answer(msg)); //답변
  }
});

client.login(tokens("discord"));

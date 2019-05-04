// 기본 설정

const Discord = require("discord.js");
var admin = require("firebase-admin");

const client = new Discord.Client();

const tokens = require("./tokens/tokens.js"); // 토큰 가져오기
var serviceAccount = tokens("firebase");

const errors = require("./errors.json");


/////////////////////////////////////////////////////////
//firebase 연결 영역
/////////////////////////////////////////////////////////
admin.initializeApp({ // firebase 실행
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://serviqbot.firebaseio.com"
});

var db = admin.database(); // db
var ref = db.ref("servers/"); // db 위치
ref.once("value", function(data) {
  console.log(data.val()); // db위치에서 json정보 가져오기
});
/////////////////////////////////////////////////////////

const prefix = "$";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("$help를 입력하세요!");
});

client.on("message", msg => {
  if (msg.content.startsWith(prefix)) { //접두사로 시작한다면
    console.log(msg.content);
    msg.reply(runCommand(msg)); //답변
  } else if (msg.content.startsWith("**<투표>** ")) {
    msg.react("👍");
    sleep(500).then(() => {
      msg.react("👎");
    });
  }
});

function runCommand(msg){
  let content = msg.content;
  let splited = content.split(" ");

  let guildID = msg.channel.guild.id;

  const commands = {
    "say": param => param,
    "svote": function(param) {
      ref.child(guildID).update({
        voteChannel: param
      });

      ref.once("value", function(data) {
        console.log("새로운 투표 채널 개설 됨. " + data.val()); // db위치에서 json정보 가져오기
      });

      return `:white_check_mark: 이제 이 서버의 투표 채널은 ${param}입니다.`;
    },
    "nvote": function(param) {
      ref.once("value", function(data) {
        try {
          let voteChannel = data.val()[guildID].voteChannel.slice(2, -1);
          client.channels.get(voteChannel).send("**<투표>** " + param);

          return `:white_check_mark: 투표가 열렸습니다.`;
        } catch (e) {

        }
      });
      return errorPrint("NO_VOTE_CHANNEL");
    },
    "help": () => {return new Discord.RichEmbed()
    .setTitle("명령어 도움말")
    .addField(`${prefix}say <할 말>`, "<할 말>을 말합니다.")
    .addField(`${prefix}svote <#채널명>`, "투표 채널을 <#채널명>으로 변경합니다.")
    .addField(`${prefix}nvote <투표 내용>`, "설정된 투표 채널에 <투표 내용> 투표를 엽니다.");
    }
  };

  try {
    let param = splited.slice(1).join(" ");
    if(commands.hasOwnProperty(splited[0].slice(1))) {
      return commands[splited[0].slice(1)](param);
    } else {
      return errorPrint("COMMAND_ERROR");
    }
  } catch (e) {
    return errorPrint("COMMAND_ERROR");
  }

  function errorPrint(errorCode) {
    const erembed = new Discord.RichEmbed()
      .setTitle(":warning: 오류!")
      .setDescription(errors[errorCode])
      .setColor("#ED0000")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL);
    return erembed;
  }
}

client.login(tokens("discord"));

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

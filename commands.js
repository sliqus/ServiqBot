const commands = {
  "말하기": param => param
};

function answer(msg){
	let splited = msg.content.split(" ")
    if(splited.length >= 3) {
      let params = splited.slice(2);
      return commands[splited[1]](params.join(" "));
    }else{
    	return "ㅇㅇ";
    }
}

console.log(answer({content: "sq 말하기 안녕"}));
module.exports = answer;

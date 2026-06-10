const { Server } = require("socket.io");


let io;

const onlineUsers = {};



const initSocket = (server)=>{


io = new Server(server,{

cors:{
origin:"*"
}

});





io.on("connection",(socket)=>{


console.log(
"User Connected:",
socket.id
);





socket.on("join",(userId)=>{


console.log(
"JOIN EVENT RECEIVED:",
userId
);



onlineUsers[userId]=socket.id;


socket.userId=userId;



io.emit(
"userOnline",
userId
);



});









// typing

socket.on(
"typing",
({receiverId,senderName})=>{


const receiverSocket =
onlineUsers[receiverId];


if(receiverSocket){


io.to(receiverSocket)
.emit(
"userTyping",
senderName
);


}


});







socket.on(
"stopTyping",
({receiverId})=>{


const receiverSocket =
onlineUsers[receiverId];


if(receiverSocket){


io.to(receiverSocket)
.emit(
"userStoppedTyping"
);


}


});









// MESSAGE SEEN

socket.on(
"messageSeen",
({senderId})=>{


const senderSocket =
onlineUsers[senderId];



if(senderSocket){


io.to(senderSocket)
.emit(
"seenUpdate"
);


}



});









socket.on(
"disconnect",
()=>{


console.log(
"User Disconnected:",
socket.id
);



const userId = socket.userId;



if(userId){


delete onlineUsers[userId];


io.emit(
"userOffline",
userId
);


}



});


});



return io;


};






const getIO=()=>io;


const getOnlineUsers=()=>onlineUsers;




module.exports={

initSocket,

getIO,

getOnlineUsers

};
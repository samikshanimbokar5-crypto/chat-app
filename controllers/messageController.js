const Message = require("../models/Message");

const {
getIO,
getOnlineUsers
}=require("../socket");





const sendMessage=async(req,res)=>{


try{


const {
receiverId,
text
}=req.body;




const onlineUsers=getOnlineUsers();



let status="sent";



if(onlineUsers[receiverId]){

status="delivered";

}



const newMessage=await Message.create({

senderId:req.user._id,

receiverId,

text,

status

});





const io=getIO();



const receiverSocket =
onlineUsers[receiverId];




if(receiverSocket){


io.to(receiverSocket)
.emit(
"receiveMessage",
newMessage
);


}




res.status(201)
.json(newMessage);



}

catch(error){


console.log(error);


res.status(500)
.json({

message:"Server Error"

});


}


};









const getMessages=async(req,res)=>{


try{


const {id}=req.params;




const messages =
await Message.find({

$or:[


{

senderId:req.user._id,

receiverId:id

},


{

senderId:id,

receiverId:req.user._id

}

]


})

.sort({

createdAt:1

});





// mark received messages as seen

await Message.updateMany(

{

senderId:id,

receiverId:req.user._id,

status:{
$ne:"seen"
}

},


{

status:"seen"

}


);






res.status(200)
.json(messages);



}

catch(error){


console.log(error);


res.status(500)
.json({

message:"Server Error"

});


}


};






module.exports={

sendMessage,

getMessages

};
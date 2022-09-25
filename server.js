const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/user');



const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

// handle cors
const whiteList = ['http://localhost:8080']
app.use(cors({
    origin: (origin,callback) => {
        if (whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error("CORS error"));
        }
    },
    optionSuccessStatus: 200
}))


// set static folder
app.use(express.static(path.join(__dirname,'public')));

// handle routing
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', [express.json(),require('./router')])

// run when client connects
io.on('connection', socket => {
    socket.once('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage("bot",`welcome to the chatroom ${room}`));
        // broadcast when a user connects
       // not sending to the current user 
        socket.to(user.room).emit('message', formatMessage("bot",`${username} has joined the chat`));
    })
    
   
    
    

    // run when disconunect
    socket.on('disconnect', () => {
        io.emit('message', formatMessage("bot",'A user has left the chat'))
    });
    // listen for chatMessage
    socket.on('chatMessage', ({username,msg}) => {
        io.emit('message', formatMessage(username,msg));

    })

})

// message submit

const PORT = 3000 || process.eventNa
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});



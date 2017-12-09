let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('send-message', (message) => {
    if(message !== 'undefined' && message !== null)
    {
      console.log('User: ' + message.username + ' says: ' + message.message);
      connectedUsers.push(Object.assign({
        socketId: socket,
        username: message.username,
      }));
    io.emit('send-message', message);
    }
  })
  socket.on('disconnect', () => {
    let userIndex = connectedUsers.findIndex(user => user.socketId === socket)
    let disconnectedUser = connectedUsers[userIndex];
    if(disconnectedUser)
    {
      console.log(disconnectedUser.username + ' has disconnected.');
      io.emit('user-disconnect',disconnectedUser.username + ' has disconnected.');
      connectedUsers.splice(userIndex, 1);
    }
  })
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
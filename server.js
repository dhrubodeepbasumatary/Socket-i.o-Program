const express = require('express')
const app = express()
app.use(express.static('.'))

const port=process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`Server now listening.`))
const io = require('socket.io')(server)
let count=0;
io.on('connect', function onConnect(socket)
{
  count++;
  console.log(`${socket.id} connected.`)
  let currentRoom = 'default'
  socket.join(currentRoom)
  socket.on('move to room',function moveToRoom(newRoom)
  {
   socket.leave(currentRoom)
   socket.join(newRoom)
   currentRoom = newRoom
   socket.emit('message',{
      sender: 'dhrubo admin',
      content: `You moved to room ${newRoom}`
    })
  })
  socket.on('message',function onReceiveMessage(message){
  socket.to(currentRoom).emit('message',{
  sender: socket.id,
  content: message
  })
	console.log(`Relayed "${message}" from ${socket.id} to #${currentRoom}`)
  })  

  socket.on('disconnect', function () {
  	count--;
  	console.log(count);
    console.log(`${socket.id} disconnected.`)
  })
})


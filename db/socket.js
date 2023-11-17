import { Server } from 'socket.io';
import Student from '../models/Student.js';
import ChatMessage from '../models/ChatMessage.js';
//import cors from 'cors';

// const getUser = (userId) => {
// 	return Student.findOne(userId);
// }

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Replace with your frontend's origin
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle chat messages
    socket.on('chat message', async (message) => {
        console.log(message, 'message')
        try{
      // Save the message to MongoDB here if needed
      const chatMessage = new ChatMessage({
        sender: message.sender,
        recipient: message.recipient,
        message: message.message,
      });

      const savedMessage = await chatMessage.save();

      // Emit the message to all connected clients
      io.emit('chat message', savedMessage);
    }catch(error){
        console.error('Error saving chat message:', error);

    }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  return io;
};

export default initializeSocket;
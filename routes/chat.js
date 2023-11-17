import express from 'express';
import ChatMessage from '../models/ChatMessage.js';

const chatRouter = express.Router();

chatRouter.get('/history/:sender/:recipient', async (req, res) => {
    try {
      const { sender, recipient } = req.params;
  
      // Retrieve chat messages from the database
      const chatHistory = await ChatMessage.find({
        $or: [
          { sender, recipient },
          { sender: recipient, recipient: sender },
        ],
      }).populate('sender').populate('recipient').sort({ timestamp: 1 }); // Sort by timestamp in ascending order
  
      res.status(200).json(chatHistory);
    } catch (error) {
      console.error('Error retrieving chat history:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  export default chatRouter
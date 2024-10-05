// src/DoctorChat.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function DoctorChat() {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const [messageData, setMessageData] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Fetch message data
  useEffect(() => {
    const fetchMessage = async () => {
      const docRef = doc(db, 'doctorMessages', messageId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessageData({ id: docSnap.id, ...docSnap.data() });
        // Assign doctor if not already assigned
        if (!docSnap.data().doctorId) {
          await updateDoc(docRef, {
            doctorId: auth.currentUser.uid,
            status: 'in-progress',
          });
        }
      } else {
        console.error('No such message!');
        navigate('/doctor/dashboard');
      }
    };
    fetchMessage();
  }, [messageId, navigate]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const docRef = doc(db, 'doctorMessages', messageId);
    await updateDoc(docRef, {
      chatHistory: arrayUnion({
        sender: 'doctor',
        message: newMessage,
        timestamp: new Date(),
      }),
    });
    setNewMessage('');
    // Refresh chat history
    const docSnap = await getDoc(docRef);
    setMessageData({ id: docSnap.id, ...docSnap.data() });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chat with Patient
      </Typography>

      {/* Chat Messages */}
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messageData?.chatHistory.map((msg, index) => (
          <Typography key={index} align={msg.sender === 'doctor' ? 'right' : 'left'}>
            <strong>{msg.sender === 'doctor' ? 'You' : 'Patient'}:</strong> {msg.message}
          </Typography>
        ))}
      </div>

      {/* Message Input */}
      <TextField
        fullWidth
        variant="outlined"
        label="Type your message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ mt: 1 }}>
        Send
      </Button>
    </Container>
  );
}

export default DoctorChat;

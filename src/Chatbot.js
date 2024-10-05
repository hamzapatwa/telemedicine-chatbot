// src/Chatbot.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { getFunctions } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';

function Chatbot() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [showContactDoctorOption, setShowContactDoctorOption] = useState(false);

  const { symptoms, severity } = location.state || {};

  // Load user data
  useEffect(() => {
    if (!symptoms || !severity) {
      navigate('/symptoms');
    }
  }, [symptoms, severity, navigate]);

  // Handle sending message to AI
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user's message to chat
    const newMessages = [
      ...messages,
      { sender: 'user', text: inputMessage },
    ];
    setMessages(newMessages);
    setInputMessage('');

    // Increment message count
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);

    // Show contact doctor option if message count >= 15
    if (newMessageCount >= 15) {
      setShowContactDoctorOption(true);
    }

    // Get user data
    const userId = auth.currentUser.uid;
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();

    // Prepare prompt for AI
    const prompt = `
      Patient Information:
      - Gender: ${userData.gender}
      - Age: ${userData.age}
      - Symptoms: ${symptoms.join(', ')}
      - Symptom Severity: ${JSON.stringify(severity)}
      - Medications: ${userData.medications}
      - Medical History: ${userData.medicalHistory}
      - Allergies: ${userData.allergies}

      Conversation so far:
      ${newMessages.map((msg) => `${msg.sender}: ${msg.text}`).join('\\n')}

      AI Assistant, please respond to the user's last message.
    `;

    // Call AI function (simulate for now)
    const functions = getFunctions();
    const getAIResponse = httpsCallable(functions, 'getAIResponse');
    try {
      const result = await getAIResponse({ prompt });
      const aiReply = result.data.reply;

      // Add AI's response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: aiReply },
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'Sorry, something went wrong.' },
      ]);
    }
  };

  // Handle contacting a doctor
  const handleContactDoctor = async () => {
    // Generate summary (simulate for now)
    const summary = `User is experiencing ${symptoms.join(
      ', '
    )} with severities ${JSON.stringify(severity)}.`;

    // Save message to Firestore
    await db.collection('doctorMessages').add({
      userId: auth.currentUser.uid,
      subject: 'Assistance Needed',
      summary,
      chatHistory: messages,
      status: 'pending',
      doctorId: null,
      createdAt: new Date(),
    });

    alert('Your message has been sent to a doctor.');
    navigate('/user/dashboard');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chatbot
      </Typography>
      {/* Chat Messages */}
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <Typography key={index} align={msg.sender === 'user' ? 'right' : 'left'}>
            <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </Typography>
        ))}
      </div>

      {/* Message Input */}
      <TextField
        fullWidth
        variant="outlined"
        label="Type your message"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ mt: 1 }}>
        Send
      </Button>

      {/* Contact Doctor Option */}
      {showContactDoctorOption && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleContactDoctor}
          sx={{ mt: 2 }}
        >
          Not satisfied? Click here to send a message to a REAL doctor!
        </Button>
      )}
    </Container>
  );
}

export default Chatbot;

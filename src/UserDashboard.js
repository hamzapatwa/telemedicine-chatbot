// src/UserDashboard.js

import React, { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function UserDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // Fetch user's messages
  useEffect(() => {
    const userId = auth.currentUser.uid;
    const messagesRef = collection(db, 'doctorMessages');
    const q = query(messagesRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      {/* List of Previous Chats */}
      <Typography variant="h6" gutterBottom>
        Your Messages
      </Typography>
      <List>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            button
            onClick={() => navigate(`/user/chat/${msg.id}`)}
          >
            <ListItemText
              primary={msg.subject}
              secondary={`Status: ${msg.status}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Buttons */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/symptoms')}
        sx={{ mt: 2, mr: 2 }}
      >
        Start New Chat
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Container>
  );
}

export default UserDashboard;

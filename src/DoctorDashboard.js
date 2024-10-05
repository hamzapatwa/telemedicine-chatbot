// src/DoctorDashboard.js

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

function DoctorDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // Fetch messages assigned to the doctor or unassigned
  useEffect(() => {
    const doctorId = auth.currentUser.uid;
    const messagesRef = collection(db, 'doctorMessages');
    const q = query(
      messagesRef,
      where('status', 'in', ['pending', 'in-progress']),
      where('doctorId', 'in', [null, doctorId])
    );

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
        Doctor Dashboard
      </Typography>

      {/* List of Messages */}
      <Typography variant="h6" gutterBottom>
        Patient Messages
      </Typography>
      <List>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            button
            onClick={() => navigate(`/doctor/chat/${msg.id}`)}
          >
            <ListItemText
              primary={msg.subject}
              secondary={`Status: ${msg.status}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
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

export default DoctorDashboard;

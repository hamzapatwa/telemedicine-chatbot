// src/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

function ProtectedRoute({ children, allowedRoles }) {
  const user = auth.currentUser;
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    if (user) {
      // Fetch user data from Firestore
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userData && allowedRoles.includes(userData.accountType)) {
    return children;
  }

  return <Navigate to="/" />;
}

export default ProtectedRoute;

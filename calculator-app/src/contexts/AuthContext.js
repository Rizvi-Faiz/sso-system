import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { verifyFirebaseToken, logout, checkAuth } from '../api/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const { accessToken, user } = await verifyFirebaseToken(idToken);
      
      localStorage.setItem('accessToken', accessToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const { accessToken, user } = await verifyFirebaseToken(idToken);
      
      localStorage.setItem('accessToken', accessToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      const { accessToken, user } = await verifyFirebaseToken(idToken);
      
      localStorage.setItem('accessToken', accessToken);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function logoutUser() {
    try {
      await logout();
      await signOut(auth);
      localStorage.removeItem('accessToken');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const { authenticated, user } = await checkAuth();
        if (authenticated && user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    googleLogin,
    logout: logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  reload,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.init";
import { api } from "../utils/api";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Save user to database
        try {
          await api.createOrUpdateUser({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            uid: firebaseUser.uid,
          });
        } catch (error) {
          console.error('Error saving user to database:', error);
          // Don't block login if database save fails
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, displayName, photoURL) => {
    try {
      // Check if user already exists in database
      const userExists = await api.checkUserExists(email);
      if (userExists) {
        const error = new Error('This email is already registered. Please login instead.');
        error.code = 'auth/email-already-in-use';
        throw error;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile with displayName and photoURL if provided
      if (displayName || photoURL) {
        const trimmedDisplayName = displayName?.trim() || "";
        const trimmedPhotoURL = photoURL?.trim() || "";

        await updateProfile(user, {
          displayName: trimmedDisplayName,
          photoURL: trimmedPhotoURL,
        });

        try {
          await reload(user);
        } catch (reloadError) {
          console.warn("Failed to reload user after profile update:", reloadError);
        }

        const refreshedUser = auth.currentUser;
        if (refreshedUser) {
          // Ensure context has the latest profile data immediately
          setUser(refreshedUser);
        } else {
          // Fallback to updating the existing user instance shallowly
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              displayName: trimmedDisplayName || prev.displayName || "",
              photoURL: trimmedPhotoURL || prev.photoURL || "",
            };
          });
        }
      }

      // Save user to database
      try {
        await api.createOrUpdateUser({
          email: user.email,
          displayName: displayName || user.displayName || '',
          photoURL: photoURL || user.photoURL || '',
          uid: user.uid,
        });
      } catch (dbError) {
        console.error('Error saving user to database:', dbError);
        // Don't block registration if database save fails
      }

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user to database (update last login)
      try {
        await api.createOrUpdateUser({
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          uid: user.uid,
        });
      } catch (dbError) {
        console.error('Error saving user to database:', dbError);
        // Don't block login if database save fails
      }

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to database
      try {
        await api.createOrUpdateUser({
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          uid: user.uid,
        });
      } catch (dbError) {
        console.error('Error saving user to database:', dbError);
        // Don't block login if database save fails
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

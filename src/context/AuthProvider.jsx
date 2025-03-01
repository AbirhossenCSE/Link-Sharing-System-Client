import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import auth from '../firebase/firebase.init';
import AuthContext from './Authcontext';




const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const signInWithGoogle = () =>{
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }
    const signOutUser = () => {
        setLoading(true);
        return signOut(auth);
    }


    const authInfo = {
        user,
        setUser,
        loading,
        auth,
        createUser,
        signInUser,
        signOutUser,
        signInWithGoogle,
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false)
            if (currentUser) {
                setUser({
                    email: currentUser.email,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                });
            } else {
                setUser(null);
            }
        });
    
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
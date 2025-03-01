import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import auth from '../firebase/firebase.init';
import AuthContext from './Authcontext';
import useAxiosPublic from '../hooks/useAxiosPublic';




const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // // for jWT-1
    const axiosPublic = useAxiosPublic();

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }
    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const signInWithGoogle = () => {
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
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            // for jWT-2
            if (currentUser) {
                // get token and store token
                const userInfo = { email: currentUser.email }
                axiosPublic.post('/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                            // setLoading(false);
                        }
                    })
            }
            else {
                localStorage.removeItem('access-token');
                // setLoading(false);
            }
            setLoading(false);
        })
        return () => {
            return () => {
                return unsubscribe();
            }
        }
    }, [axiosPublic])

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
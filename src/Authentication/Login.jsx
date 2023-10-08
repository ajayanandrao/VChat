import React, { useContext, useEffect, useState } from 'react'
import "./NewLogin.scss"
import { Link, useNavigate } from 'react-router-dom'
import SignUp from './SignUp'
import { AuthContext } from '../AuthContaxt';
import { auth, db } from '../Firebase';
import { collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, TextField } from '@mui/material';
import { useCollectionData } from 'react-firebase-hooks/firestore';
// import logo from "./../Image/img/logo192.png";
import logoText from "./../Image/c2.png";
import vlogo from "./../Image/img/logo192.png";
import { CircularProgress } from '@mui/material';

const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const [loading, setLoading] = useState(true);

    const nav = useNavigate();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Simulating an asynchronous operation with setTimeout
                setLoading(true);
                setTimeout(() => {
                    nav("/home");
                    setLoading(false);
                }, 1000);
            } else {
                setTimeout(() => {
                    nav("/");
                    setLoading(false); // Stop showing loading state
                }, 1000);
            }
        });

        return () => {
            unsubscribe(); // Cleanup the subscription when the component unmounts
        };
    }, []);

    const [loginloading, setLoginLoading] = useState(false);

    const login = (e) => {
        e.preventDefault();
        setLoginLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;

                const PresenceRef = doc(db, "userPresece", user.uid);

                await updateDoc(PresenceRef, {
                    status: "online",
                });


                const PresenceRefOnline = doc(db, "OnlyOnline", user.uid);

                const userData = {
                    status: 'Online',
                    uid: user.uid,
                    presenceName: user.displayName,
                    email: email,
                    photoUrl: user.photoURL,
                    presenceTime: new Date()
                    // presenceTime: new Date()
                };

                await setDoc(PresenceRefOnline, userData);

                // console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                if (errorCode == "auth/wrong-password") {
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "Wrong Password";
                }
                if (errorCode == "auth/missing-password") {
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "incorrect email and password";
                }
                if (errorCode == "auth/user-not-found") {
                    function alert() {

                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "User not found";
                    }
                    alert();
                }
                if (errorCode == "auth/invalid-email") {
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "invalid email address";
                }
                if (errorCode == "auth/network-request-failed") {
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "Check your internet connection";
                }
            });

        setEmail("");
        setPass("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            login(e); // Call the login function when Enter key is pressed
        }
    };

    if (!email == "") {
        document.getElementById("error-alert").innerHTML = "";
    }
    if (!password == "") {
        document.getElementById("error-alert").innerHTML = "";
    }

    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        // Use setTimeout to toggle the 'showFooter' state after 2 seconds
        const timeoutId = setTimeout(() => {
            setShowFooter(true);
        }, 1500);

        // Cleanup the timeout to prevent memory leaks when the component unmounts
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <>

            {loading ? (
                <div className='login-wellcome-div'>

                    <div className='loaing-logo' style={{ backgroundImage: `url(${vlogo})` }} >
                    </div>
                </div>
            ) : (


                <div className='loging-container'>

                    <div className="login-div">

                        <div className="brand-wrapper">
                            <div>
                                <img src={vlogo} width={"50px"} alt="" />
                            </div>
                            <div className='brand-name'> Chat App </div>
                        </div>

                        <div className="login-form-wrapper">
                            <input className="login-inputs " type="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <input className="login-inputs " type="password"
                                placeholder="Password"
                                onChange={(e) => setPass(e.target.value)}
                                value={password}
                                onKeyDown={handleKeyDown}
                            />


                            <div className="" id="error-alert" ></div>

                            <button className=" btn btn-primary w-100 my-3" style={{ borderRadius: "30px", fontSize: "18px", padding: "4px 10px" }} onClick={login} >
                                {loginloading ?
                                    <CircularProgress style={{ color: "white", width: "16px", height: "16px" }} />
                                    :
                                    "Log in"
                                }
                            </button>

                            <Link to="/forgotPassword/" className='forgot-text'>Forgotten password?</Link>

                            <Link to="/signUp/" className='link'>
                                <button className="btn btn-link w-100" style={{ borderRadius: "30px" }}>Create New Account</button>
                            </Link>

                        </div>
                    </div>
                </div>

            )}

            {showFooter && (
                <div className='forgott-footer-bottom'>
                    Copyright © VChat App 2023.
                </div>
            )}

        </>
    )
}

export default Login


import React, { useContext, useEffect, useState } from 'react'
import "./NewLogin.scss"
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContaxt';
import { auth, db, provider, providerFacebook, providerGit, providerMicrosoft, realdb, storage } from '../Firebase';
import { addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
// import logo from "./../Image/img/logo192.png";
import vlogo from "./../Image/img/logo192.png";
import { CircularProgress } from '@mui/material';
import google from "./../Image/img/google.png";
import git from "./../Image/img/github.png";
import microsoft from "./../Image/img/microsoft2.png";
import down from "./../Image/img/4x/arrowdown.png";
import post from "./../Image/img/post.mp4"

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
                await updateDoc(PresenceRef, { status: "online" });

                const PresenceRefOnline = doc(db, "OnlyOnline", user.uid);
                const userData = {
                    status: 'Online',
                    uid: user.uid,
                    presenceName: user.displayName,
                    email: email,
                    photoUrl: user.photoURL,
                    presenceTime: new Date()
                };
                await setDoc(PresenceRefOnline, userData);

                // Navigate to the home page or perform other actions
                nav("/home");


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.log(errorCode);
                setLoginLoading(false);

                // Handle different error codes and display appropriate messages
                switch (errorCode) {
                    case "auth/wrong-password":
                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "Wrong Password";
                        break;
                    case "auth/invalid-login-credentials":
                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "Wrong Password";
                        break;
                    case "auth/missing-password":
                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "Incorrect email and password";
                        break;
                    case "auth/user-not-found":
                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "User not found";
                        break;
                    case "auth/invalid-email":
                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "Invalid email address";
                        break;
                    case "auth/network-request-failed":
                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "Check your internet connection";
                        break;
                    default:
                    // Handle other errors as needed
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

    document.body.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent the default context menu
        // You can optionally display a custom message if needed
        // alert('Right-click context menu is disabled.');
    });


    useEffect(() => {
        const handleContextMenu = (event) => {
            event.preventDefault(); // Prevent the default context menu
            // alert('Access Denied');
        };

        document.body.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.body.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    const HandleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            const colRef = collection(db, "users");
            const userQuery = query(colRef, where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                try {
                    await addDoc(colRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        PhotoUrl: user.photoURL,
                        accessToken: user.accessToken,

                        school: "",
                        college: "",
                        work: "",
                        from: "",
                        intro: "",
                        bytime: serverTimestamp(),
                    });

                    const userPreferencesRef = doc(db, 'UserPreferences', currentUser.uid);
                    await setDoc(userPreferencesRef, { theme: "light" });

                    // console.log("New user document added:");

                } catch (error) {
                    console.error("Error adding the user document:", error);
                }
            } else {
                // A document with the same UID already exists
                // console.log("User document with the same UID already exists.");
            }


        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            // If the error provides additional email information:
            const email = error.email;

            // You can also get the AuthCredential type used for the error, if available.
            const credential = GoogleAuthProvider.credentialFromError(error);

            // Handle the error (e.g., display an error message to the user).
            console.error('Google Authentication Error:', errorCode, errorMessage);

            // You can customize the error handling based on your application's needs.
        }
    };


    const HandleMicrosoftAuth = async () => {
        try {
            const result = await signInWithPopup(auth, providerMicrosoft);
            const credential = OAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            // console.log(user);
            const colRef = collection(db, "users");
            const userQuery = query(colRef, where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                try {
                    await addDoc(colRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        PhotoUrl: user.photoURL,
                        accessToken: user.accessToken,
                        GitHub: "GitHub",
                        school: "",
                        college: "",
                        work: "",
                        from: "",
                        intro: "",
                        bytime: serverTimestamp(),
                    });

                    const userPreferencesRef = doc(db, 'UserPreferences', currentUser.uid);
                    await setDoc(userPreferencesRef, { theme: "light" });

                    // console.log("New user document added:");

                } catch (error) {
                    console.error("Error adding the user document:", error);
                }
            } else {
                // A document with the same UID already exists
            }

        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            // If the error provides additional email information:
            const email = error.email;

            // You can also get the AuthCredential type used for the error, if available.
            const credential = OAuthProvider.credentialFromError(error);

            console.error('Google Authentication Error:', errorCode, errorMessage);
        }
    };


    const HandleGitHubAuth = async () => {
        try {
            const result = await signInWithPopup(auth, providerGit);
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            // console.log(user);
            const colRef = collection(db, "users");
            const userQuery = query(colRef, where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(userQuery);

            const userPreferencesRef = doc(db, 'UserPreferences', currentUser.uid);
            await setDoc(userPreferencesRef, { theme: "light" });

            if (querySnapshot.empty) {
                try {
                    await addDoc(colRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        PhotoUrl: user.photoURL,
                        accessToken: user.accessToken,
                        GitHub: "GitHub",
                        school: "",
                        college: "",
                        work: "",
                        from: "",
                        intro: "",
                        bytime: serverTimestamp(),
                    });
                    // console.log("New user document added:");

                } catch (error) {
                    // console.error("Error adding the user document:", error);
                }
            } else {
                // A document with the same UID already exists
            }


        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;

            const credential = GithubAuthProvider.credentialFromError(error);
        }
    };


    const scrollToNext = (id) => {
        const element = document.getElementById(`section2-${id}`);
        if (element && element.nextElementSibling) {
            element.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
        }

    };


    const scrollToIdOne = (id) => {
        const element = document.getElementById(`section2-1`);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>


            {loading ? (
                <div className='login-wellcome-div'>
                    <img src={vlogo} className='loaing-logo' alt="VChat" />
                </div>
            ) : (

                <>
                    <div className='loging-container'>
                        <div className="login-div">
                            <div className="brand-wrapper">

                                <div>
                                    <img src={vlogo} width={"50px"} alt="" />
                                </div>
                                <div className='brand-name'>VChat </div>
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

                                <button className=" btn btn-primary w-100 my-3 btn-shadow" style={{ borderRadius: "30px", fontSize: "18px", padding: "3px 10px" }} onClick={login} >
                                    {loginloading ?
                                        <CircularProgress style={{ color: "white", width: "16px", height: "16px" }} />
                                        :
                                        "Log in"
                                    }
                                </button>
                                <Link to="/forgotPassword/" className='forgot-text'>Forgotten password?</Link>

                                <div className="auth-link-or-div">
                                    <div className="auth-link-left-border"><div className="left-bordr"></div></div>
                                    <div className="auth-link-or">or</div>
                                    <div className="auth-link-left-border"><div className="left-bordr"></div></div>
                                </div>

                                <div className='auth-link-div'>
                                    <div className=' '>
                                        <img src={google} className='login-with' alt="" onClick={HandleGoogleAuth} />
                                    </div>

                                    <div className=' '>
                                        <img src={microsoft} className='login-with' style={{ width: "30px", height: "30px" }} alt="" onClick={HandleMicrosoftAuth} />
                                    </div>

                                    <div className=' '>
                                        <img src={git} className='login-with' alt="" onClick={HandleGitHubAuth} />
                                    </div>
                                </div>


                                <Link to="/signUp/" className='link'>
                                    <button className="btn btn-link w-100 mb-4" style={{ borderRadius: "30px" }}>Create New Account</button>
                                </Link>
                            </div>
                            {/* <FaChevronDown className=' btn-primary arrowDown-login' /> */}
                        </div>
                        <img src={down} className=' arrowDown-login' alt="" />

                    </div >

                    <div className="about-section-one">

                        <div className="about-col-one">
                            <div className="about-col-one-text">
                                <span className='about-col-one-send-text'>  Send  Message Files Photo Music Video  to your friend and family. </span>
                            </div>
                        </div>

                        <div className="about-col-two">
                            <div className="about-col-two-card">
                                <img className='about-card-two-emoji' src="https://i.ibb.co/0YmB22g/Grinning-Face-with-Big-Eyes.png" alt="" />
                                <div className="about-col-two-card-inner">
                                    <video className='about-col-two-video' autoPlay muted loop src="https://firebasestorage.googleapis.com/v0/b/hosting-c26ea.appspot.com/o/login%2Fchat.mp4?alt=media&token=ae1d92c3-ce4e-4e5f-9abe-35eeba7561f6"></video>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-section-one about-col-second">

                        <div className="about-col-one">
                            <div className="about-col-one-text">
                                <span className='about-col-one-send-text'>
                                    Post your thoughts
                                </span>⛱️
                            </div>
                        </div>

                        <div className="about-col-two ">
                            <div className="about-col-two-card-second">
                                <div className="about-col-two-card-inner-second">
                                    <video className='about-col-two-video' autoPlay muted loop src={post}></video>
                                </div>
                            </div>
                        </div>
                    </div>

                </>

            )}


            <div class="footer-div text-center p-4 bg-light_0 dark:bg-dark text-lightPostText dark:text-darkPostText" >
                {/* <span className='me-2'>About</span> */}
                © 2022 Copyright:
                <a class="text-reset fw-bold" > VChat.in</a>
            </div>
        </>
    )
}

export default Login



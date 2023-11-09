import React, { useEffect, useState } from 'react'
import "./NewSignup.scss";
import { Link, useNavigate, useRoutes } from 'react-router-dom';
import { auth, db, storage } from "./../Firebase";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { BsFillCameraFill } from "react-icons/bs";
// import logoText from "./../Image/c2.png";
// import g from "./../Image/google.png";
// import f from "./../Image/facebook.png";
// import i from "./../Image/instagram.png";
// import user from "./../Image/user3.png";
import vlogo from "./../Image/img/logo192.png";

const SignUp = () => {

    const nav = useNavigate();

    const [img, setImg] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const colRef = collection(db, "users");


    useEffect(() => {
        const unsub = onSnapshot(colRef, (snapshot) => {
            const arry = [];
            (snapshot.forEach((doc) => arry.push({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);


    const compressImage = async (imageFile, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(imageFile);
        });
    };

    if (password.length > 8) {
        document.getElementById("errorPass").innerHTML = ""
    }

    const submit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            document.getElementById("errorPass").innerHTML = "Password should be 8 characters"
            return
        } else {
            document.getElementById("errorPass").innerHTML = ""
        }

        setEmail("");
        setPass("");

        if (img) {
            if (img.type.startsWith('image/')) {

                try {

                    const compressedImgBlob = await compressImage(img, 800);
                    const res = await createUserWithEmailAndPassword(auth, email, password)

                    const storageRef = ref(storage, "userPhotos/" + name);
                    const uploadTask = uploadBytesResumable(storageRef, compressedImgBlob);
                    // ------------------

                    uploadTask.on('state_changed',
                        (snapshot) => {

                        },
                        (error) => {
                            // Handle unsuccessful uploads
                        },
                        () => {

                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                // console.log('File available at', downloadURL);
                                await updateProfile(res.user, {
                                    displayName: name,
                                    photoURL: downloadURL,
                                }).then(() => {
                                    // Profile updated!
                                    // ...
                                }).catch((error) => {
                                    // An error occurred
                                    // ...
                                });

                                await addDoc(colRef, {
                                    uid: res.user.uid,
                                    name: name,
                                    email: email,
                                    password: password,
                                    PhotoUrl: downloadURL,

                                    school: "",
                                    college: "",
                                    work: "",
                                    from: "",
                                    intro: "",
                                    bytime: serverTimestamp(),
                                });

                                const PresenceRef = doc(db, "userPresece", res.user.uid);

                                await setDoc(PresenceRef, {
                                    status: "online",
                                    uid: res.user.uid,
                                    presenceName: name,
                                    email: email,
                                    photoUrl: downloadURL,
                                    presenceTime: new Date(),
                                });

                                const userPreferencesRef = doc(db, 'UserPreferences', res.user.uid);
                                await setDoc(userPreferencesRef, { theme: "light" });

                                const PresenceRefOnline = doc(db, "OnlyOnline", res.user.uid);

                                const userData = {
                                    status: 'Online',
                                    uid: res.user.uid || '',
                                    presenceName: res.user.displayName || '',
                                    presenceName: name || '',
                                    email: email || '',
                                    photoUrl: res.user.photoURL || '',
                                    presenceTime: new Date()
                                    // presenceTime: new Date()
                                };

                                await setDoc(PresenceRefOnline, userData);

                                setDoc(doc(db, "userPostsList", res.user.uid), { messages: [] });

                                const UpdateProfile = doc(db, "UpdateProfile", res.user.uid);

                                await setDoc(UpdateProfile, {
                                    name: name,
                                    userPhoto: downloadURL,
                                    uid: res.user.uid,
                                    bytime: serverTimestamp(),
                                });

                                // ---------------

                                const WellcomeProfile = doc(db, "Wellcome", res.user.uid);

                                await setDoc(WellcomeProfile, {
                                    name: name,
                                    userPhoto: downloadURL,
                                    uid: res.user.uid,
                                    bytime: serverTimestamp(),
                                    seen: "WelcomFalse",
                                });

                            });
                        }
                    );

                    nav("/welcome");

                } catch (err) {
                    alert(err.message);
                    // console.log(err.message);
                    // console.log(err.code);
                    if (err.code == "auth/invalid-email") {
                        document.getElementById("error").innerHTML = "Invalid email";
                        return
                    }
                }
            }

        }



        setImg(null);
        setName("");

    };

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
            <div className="signup-container">
                <div className="signup-div">

                    <div className="brand-wrapper">
                        <div>
                            <img src={vlogo} width={"50px"} alt="" />
                        </div>
                        <div className='brand-name'>  Chat App </div>
                    </div>

                    <div className='signUp-camera'>
                        {img ?
                            <label htmlFor="photo"  >
                                <img className="singup-img-form" src={img ? URL.createObjectURL(img) : null} alt="" />
                            </label>
                            :
                            (
                                <div className='signup-camera-icon-div'>
                                    <label htmlFor="photo"  >
                                        <BsFillCameraFill className='signup-camera-icon' />
                                    </label>
                                </div>)}

                        <input type="file" className="photoinput" id="photo" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                        <div className='set-profile-photo-name'>{img ? "" : "Set Profile Photo"}</div>
                    </div>

                    <div className="signup-form-wrapper">
                        <input className="signup-inputs mt-1" type="text"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <input className="signup-inputs mt-1" type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input className="signup-inputs my-1" type="password"
                            placeholder="Password"
                            onChange={(e) => setPass(e.target.value)}
                            value={password}
                        />

                        <div id="errorPass" style={{ color: "red" }}></div>

                        <button className="btn btn-primary w-100  my-3 btn-shadow"
                            style={{ borderRadius: "30px", fontSize: "18px", padding: "4px 10px" }} onClick={submit} >Sign Up</button>


                        <Link to="/" className='link mt-4'>
                            <button className="btn btn-link w-100" style={{ borderRadius: "30px" }}>Already have an account ?</button>
                        </Link>

                    </div>
                </div>

                {/* {showFooter && (
                    <div className='forgott-footer-bottom'>
                        Copyright © VChat App 2023.
                    </div>
                )} */}
            </div>
        </>
    )
}

export default SignUp

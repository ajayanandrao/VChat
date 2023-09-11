import React, { useEffect, useState } from 'react'
import "./Signup.scss";
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from "./../Firebase";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { BsFillCameraFill } from "react-icons/bs";
import logoText from "./../Image/c2.png";
import g from "./../Image/google.png";
import f from "./../Image/facebook.png";
import i from "./../Image/instagram.png";
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

    const submit = async (e) => {
        e.preventDefault();

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
                                })

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
                }
            }

        }

        setImg(null);
        setName("");
        setEmail("");
        setPass("");
    };



    return (
        <>
            <div className="signUp-main-container">
                <div className="signUp-wrapper">
                    <div className="app-logo-div">
                        <img src={vlogo} width={"50px"} alt="" />
                        <h2 className='logo-name'>Chat App</h2>
                    </div>

                    <label htmlFor="photo" className='signUp-camera' >
                        {img ? <img className="singup-img-form" src={img ? URL.createObjectURL(img) : null} alt="" /> :
                            (
                                <div className='signup-camera-icon-div'>
                                    {/* <BsFillCameraFill className='signup-camera-icon' /> */}
                                    <img className='signup-camera-icon' width={"80px"}
                                        src="https://cdn3d.iconscout.com/3d/premium/thumb/profile-account-8672662-6945124.png?f=webp" alt="" />
                                </div>)}

                        <input type="file" className="photoinput" id="photo" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                    </label>

                    <div className="signUp-form-div">
                        <input className="Auth-input-new mt-2" type="text"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <input className="Auth-input-new mt-2" type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input className="Auth-input-new my-2" type="password"
                            placeholder="Password"
                            onChange={(e) => setPass(e.target.value)}
                            value={password}
                        />

                        <button className="btn-primary-custom w-100 my-4"
                            onClick={submit}>Sign Up</button>

                        <div className='or'>or</div>

                        <Link to="/" className='link'>
                            <div className='btn-success-outline create-new-a mt-3'> Already have an account ?</div>
                        </Link>

                    </div>
                </div>

                <div className="footer">
                    © 2023 Copyright: VChatApp.co.in
                </div>
            </div>



        </>
    )
}

export default SignUp

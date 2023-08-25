import React, { useEffect, useState } from 'react'
import "./Signup.scss";
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from "./../Firebase";
import { addDoc, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { BsFillCameraFill } from "react-icons/bs";
import logoText from "./../Image/c2.png";
import g from "./../Image/google.png";
import f from "./../Image/facebook.png";
import i from "./../Image/instagram.png";

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
                                    // bytime: serverTimestamp(),
                                });

                                const PresenceRef = doc(db, "userPresece", res.user.uid);

                                await setDoc(PresenceRef, {
                                    status: "online",
                                    uid: res.user.uid,
                                    presenceName: name,
                                    email: email,
                                    photoUrl: downloadURL,
                                    presenceTime: new Date()
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
                                });

                            });
                        }
                    );

                    nav("/home");

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
            <div className="Signup-form-container signup-div w3-animate-right">
                <h3 className='login-title'><img width={"120px"} src={logoText} alt="" /></h3>

                <label htmlFor="photo" >
                    {img ? <img className="singup-img-form" src={img ? URL.createObjectURL(img) : null} alt="" /> :
                        (
                            <div className='signup-camera-icon-div'><BsFillCameraFill className='signup-camera-icon' /></div>)}

                    <input type="file" className="photoinput" id="photo" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                </label>

                <div className="form-inner-div">
                    <input className="login-input-new mt-1" type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <input className="login-input-new mt-1" type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input className="login-input-new my-1" type="password"
                        placeholder="Password"
                        onChange={(e) => setPass(e.target.value)}
                        value={password}
                    />
                    <button className="btn-primary-custom w-100 my-4"
                        onClick={submit}>Sign Up</button>

                    <div className='or'>or</div>
                    <div className='link-icon-div'>
                        <img className='link-icons' style={{ width: "30px" }} src={g} alt="" />
                        <img style={{ width: "30px" }} src={f} alt="" />
                        <img style={{ width: "30px" }} src={i} alt="" />
                    </div>

                    <Link to="/" className='link'>
                        <div className='create-new-a mt-3'> Already have an account ?</div>
                    </Link>

                </div>
            </div>

            <div className='singup-footer-bottom'>Copyright © Ajay Anandaro 2023. </div>

        </>
    )
}

export default SignUp

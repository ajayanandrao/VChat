import React, { useContext, useEffect, useState } from 'react'
import "./Option.scss";
import { Link, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, realdb } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContaxt';
import { motion } from 'framer-motion';
import { CircularProgress, LinearProgress } from '@mui/material';
import { SiHelpscout } from "react-icons/si"
import { onValue, ref } from 'firebase/database';

const Option = () => {
    const { currentUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await updateDoc(PresenceRefOnline, {
                    status: 'Offline',
                    presenceTime: new Date(),
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

    const LogOut = async () => {
        setLoading(true);
        const PresenceRef = doc(db, "userPresece", currentUser.uid);

        await updateDoc(PresenceRef, {
            status: "Offline",
        });

        const PresenceRefOnline = doc(db, "OnlyOnline", currentUser.uid);
        await updateDoc(PresenceRefOnline, {
            status: 'Offline',
            presenceTime: new Date(),
            timestamp: serverTimestamp()
        });
        signOut(auth)
            .then(() => {
                setLoading(false);
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });

        nav("/");
    };

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }


    return (
        <>
            <div
                className="option-container bg-light_0 dark:bg-dark ">

                <div className="option-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostIcon"></i>
                </div>

                <div className="option-inner-div">

                    <div className="option-profile-div">
                        <motion.img
                            transition={{ duration: 1.5, delay: 0.5 }}
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            src={currentUser && currentUser.photoURL} className='option-profile-img' alt="" />

                        <motion.span
                            transition={{ duration: 0.7, delay: 0.7 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='option-profile-text text-lightProfileName dark:text-darkProfileName'>
                            {currentUser && currentUser.displayName}</motion.span>
                    </div>

                    <div className='option-item-wrapper'>
                        <motion.div>
                            {/* <Link to="/RealTime/"> */}
                            <Link to="/setting/">
                                <motion.div
                                    transition={{ duration: 0.7, delay: 0.7 }}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="option-mainu-div">
                                    <div className="option-mainu-icon">
                                        <img src={"https://cdn3d.iconscout.com/3d/premium/thumb/settings-4049810-3364114.png?f=webp"} style={{ width: "40px" }} className='option-image-icon ' alt="" />
                                    </div>
                                    <div className="option-mainu-name text-lightPostText dark:text-darkPostText">
                                        Setting
                                    </div>
                                </motion.div>
                            </Link>


                            <Link to="/gallery/">

                                <motion.div
                                    transition={{ duration: 0.9, delay: 0.9 }}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="option-mainu-div">
                                    <div className="option-mainu-icon">
                                        {/* <SiHelpscout className='text-lightProfileName dark:text-darkProfileName' style={{
                                            fontSize: "30px"
                                        }} /> */}
                                        <img src={"https://cdn3d.iconscout.com/3d/premium/thumb/gallery-8820084-7139045.png?f=webp"} style={{ width: "40px" }} className='option-image-icon' alt="" />
                                    </div>
                                    <div className="option-mainu-name text-lightPostText dark:text-darkPostText" >
                                        VChat Gallery
                                    </div>
                                </motion.div>
                            </Link>

                            <Link to="/reels/">
                                <motion.div
                                    transition={{ duration: 1.1, delay: 1.1 }}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="option-mainu-div">
                                    <div className="option-mainu-icon">
                                        <img src={"https://cdn3d.iconscout.com/3d/premium/thumb/cinema-reel-7642424-6185400.png?f=webp"} style={{ width: "45px" }} className='option-image-icon' alt="" />
                                    </div>
                                    <div className="option-mainu-name text-lightPostText dark:text-darkPostText" >
                                        Reals
                                    </div>
                                </motion.div>
                            </Link>

                            <motion.div
                                transition={{ duration: 1.3, delay: 1.3 }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="option-mainu-div">
                                <div className="option-mainu-icon">
                                    <img src={"https://cdn3d.iconscout.com/3d/premium/thumb/logout-8858045-7285381.png?f=webp"} style={{ width: "45px" }} alt="" />
                                </div>
                                <div className="option-mainu-name text-lightPostText dark:text-darkPostText" onClick={LogOut}>
                                    {loading ? (
                                        <>
                                            <CircularProgress style={{ width: "25px", height: "25px", marginTop: "10px" }} />
                                        </>
                                    ) : " Log Out"}
                                </div>
                            </motion.div>


                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Option

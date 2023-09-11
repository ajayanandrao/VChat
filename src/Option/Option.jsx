import React, { useContext } from 'react'
import "./Option.scss";
import { Link, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContaxt';
import { motion } from 'framer-motion';

const Option = () => {
    const { currentUser } = useContext(AuthContext);

    const LogOut = async () => {
        const PresenceRef = doc(db, "userPresece", currentUser.uid);

        await updateDoc(PresenceRef, {
            status: "Offline",
        });

        const PresenceRefOnline = doc(db, "OnlyOnline", currentUser.uid);
        await deleteDoc(PresenceRefOnline);

        signOut(auth)
            .then(() => {
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

                    <motion.div

                    >
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


                        <Link to="/Wedding/">
                            <motion.div
                                transition={{ duration: 0.9, delay: 0.9 }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="option-mainu-div">
                                <div className="option-mainu-icon">
                                    <img src={"https://cdn3d.iconscout.com/3d/premium/thumb/heart-4033153-3345796@0.png?f=webp"} style={{ width: "40px" }} className='option-image-icon' alt="" />
                                </div>
                                <div className="option-mainu-name text-lightPostText dark:text-darkPostText" >
                                    Matrimony Arrange
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
                                Log Out
                            </div>
                        </motion.div>


                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default Option

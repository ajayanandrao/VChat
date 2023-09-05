import React, { useContext } from 'react'
import "./Option.scss";
import { Link, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContaxt';
import { MdMovieFilter } from 'react-icons/md'

import love from "./../Image/img/png/heartsm.png";
import video from "./../Image/img/png/reel.png";
import setting from "./../Image/img/png/7374722.png";
import door from "./../Image/img/png/7285381.png";
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

                className="option-container dark:bg-darkDiv w3-animate-opacity" >

                <div className="option-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left dark:text-darkIcon "></i>
                </div>

                <div className="option-inner-div">

                    <div className="option-profile-div">
                        <img

                            src={currentUser && currentUser.photoURL} className='option-profile-img' alt="" />

                        <span

                            className='option-profile-text'>{currentUser && currentUser.displayName}</span>
                    </div>

                    <div

                    >
                        <Link to="/setting/">
                            <div className="option-mainu">

                                <div className="option-mainu-icon">

                                    <img src={setting} style={{ width: "55px" }} className='option-image-icon ' alt="" />

                                </div>
                                <div className="option-mainu-name dark:text-darkProfileName">
                                    Setting
                                </div>

                            </div>
                        </Link>


                        <Link to="/Wedding/">
                            <div className="option-mainu">
                                <div className="option-mainu-icon">

                                    <img src={love} style={{ width: "55px" }} className='option-image-icon' alt="" />

                                </div>
                                <div className="option-mainu-name dark:text-darkProfileName" >
                                    Matrimony Arrange
                                </div>
                            </div>
                        </Link>
                        <Link to="/reels/">
                            <div className="option-mainu">
                                <div className="option-mainu-icon">

                                    <img src={video} style={{ width: "40px" }} className='option-image-icon' alt="" />

                                </div>
                                <div className="option-mainu-name dark:text-darkProfileName" >
                                    Reals
                                </div>
                            </div>
                        </Link>

                        <div className="option-mainu">
                            <div className="option-mainu-icon">

                                <img src={door} style={{ width: "43px" }} alt="" />

                            </div>
                            <div className="option-mainu-name dark:text-darkProfileName" onClick={LogOut}>
                                Log Out
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}

export default Option

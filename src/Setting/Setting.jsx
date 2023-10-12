import React, { useContext, useEffect, useState } from 'react'
import "./Setting.scss";
import { MdDarkMode } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContaxt';

const Setting = () => {
    const { currentUser } = useContext(AuthContext);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

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

    const deleteAccount = async () => {
        try {
            if (currentUser) {
                console.log('Deleting account for user:', currentUser.uid);

                // Delete the user document from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                await deleteDoc(userDocRef);

                // Sign out the user
                console.log('Signing out user...');
                await LogOut();

                // Navigate to the login or home page (adjust the path as needed)
                console.log('Account deleted successfully.');
                nav('/');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting the account.');
        }
    };

    return (
        <>
            <div className="setting-container bg-light_0 dark:bg-dark">
                <div className="setting-back-div">
                    <i onClick={goBack} className="bi text-lightPostIcon dark:text-darkPostIcon bi-arrow-left setting-back"></i>
                </div>

                {/* <div className="setting-profile-div">
                    <img src={currentUser && currentUser.photoURL} className='setting-profile-img' alt="" />
                    <div className="setting-profile-name">
                        {currentUser && currentUser.displayName}
                    </div>
                </div> */}

                <div className="setting-containt">

                    <Link to="/How_to_install_app/">
                        <div className='change-password bg-lightDiv dark:bg-darkDiv dark:text-darkPostText text-lightPostText' >
                            How To install VChat App in your Phone
                        </div>
                    </Link>

                    <Link to="/policy/">
                        <div className='change-password bg-lightDiv dark:bg-darkDiv dark:text-darkPostText text-lightPostText' >
                            VChat App Policy and Terms.
                        </div>
                    </Link>

                    <Link to="/changePassword/">
                        <div className='change-password bg-lightDiv dark:bg-darkDiv dark:text-darkPostText text-lightPostText'>Change Profile Password</div>
                    </Link>
                    <Link to="/feedback/">
                        <div className='change-password bg-lightDiv dark:bg-darkDiv dark:text-darkPostText text-lightPostText'>Feedback</div>
                    </Link>
                </div>

            </div>
        </>
    )
}

export default Setting

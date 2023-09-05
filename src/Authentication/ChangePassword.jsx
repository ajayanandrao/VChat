import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from '../Firebase';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import "./ChangePassword.scss";

const ChangePassword = () => {

    const { currentUser } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [user, setUser] = useState(null); // State to hold the user object
    const [showOverlay, setShowOverlay] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const nav = useNavigate();

    const goBack = () => {
        nav(-1);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Update the user state when the authentication state changes
        });

        return () => {
            unsubscribe(); // Cleanup the observer when the component unmounts
        };
    }, []);


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


    const changePassword = async () => {
        try {
            if (user) {
                const credentials = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credentials);

                await updatePassword(user, newPassword);

                setCurrentPassword("");
                setNewPassword("");

                setShowOverlay(true);

                setTimeout(() => {
                    setShowOverlay(false);
                }, 3000);

                LogOut();
            }
        } catch (error) {

            if (error.code === "auth/wrong-password") { // Use "code" instead of "message"
                setErrorMessage("Invalid Current password"); // Update error message state
            }
        }

        setCurrentPassword("");
        setNewPassword("");
    };


    return (

        <div className='change-password-container dark:bg-darkDiv'>
            <div className="option-back-div">
                <i onClick={goBack} className="bi bi-arrow-left dark:text-darkIcon "></i>
            </div>

            <div className="change-password-container-inner ">
                <h3 style={{ textAlign: "center", marginBottom: "50px" }}
                    className='dark:text-darkProfileName text-black_0 text-3xl'
                >Change Password</h3>
                <input
                    className='login-input-new dark:bg-darkInput dark:text-darkPostText'
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />

                {errorMessage &&
                    <div className="error-message mb-2">{errorMessage}</div>
                }

                <input
                    className='login-input-new my-2 dark:bg-darkInput dark:text-darkPostText'
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="btn-primary-custom my-4" onClick={changePassword}>Change Password</button>

                {showOverlay && (
                    <div className="changePasswordOverlay">
                        <p>Password changed successfully!</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default ChangePassword;

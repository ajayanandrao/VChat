import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material';

import ProfileOne from '../Params/Component/ProfileOne';
import ProfileTwo from '../Params/Component/ProfileTwo';
import ProfileThree from '../Params/Component/ProfileThree';

import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate, useParams } from 'react-router-dom';
import "./OtherUserProfileMain.scss";
import LeftArro from '../LeftArro';
import { AuthContext } from '../AuthContaxt';
import { useContext } from 'react';
import { motion } from 'framer-motion';

const OtherUserProfileMain = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const nav = useNavigate();
    const goBack = () => {
        nav("/");
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'UpdateProfile', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUser({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);


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
    }, [currentUser && currentUser.uid]);

    if (!user) {
        return <>
            <div className='skeleton-center bg-light_0 dark:bg-dark text-lightProfileName dark:text-darkProfileName '>
                {/* <CircularProgress className='circularprogress' /> */}

                <motion.div
                    transition={{ duration: 2, delay: 2 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='d-flex' style={{ flexDirection: "column", justifyItems: "center", alignItems: "center" }}>
                    This content isn't available right now
                    <button className='btn btn-primary mt-4'
                        style={{ fontSize: "16px", padding: "5px 10px" }}
                        onClick={goBack}
                    >Go Back</button>
                </motion.div>

            </div >
        </>;
    }

    return (
        <div className='other-user-profile-main bg-light_0 dark:bg-dark'>
            <LeftArro />
            <div className="left-div"></div>
            <div className='other-user-friend-inner-div'>
                <ProfileOne user={user} />
                <ProfileTwo user={user} />
                <ProfileThree user={user} />
            </div>
        </div>
    )
}

export default OtherUserProfileMain
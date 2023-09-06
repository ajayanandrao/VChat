import React, { useEffect, useState } from 'react'
import "./CurrentUserFriendProfileMain.scss";

import ProfilePageOne from './../Params/UserProfilePages/ProfilePageOne';

import { CircularProgress } from '@mui/material';
import ProfilePageTwo from '../Params/UserProfilePages/ProfilePageTwo';
import ProfilePageThree from '../Params/UserProfilePages/ProfilePageThree';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useParams } from 'react-router-dom';
import LeftArro from '../LeftArro';




const CurrentUserFriendProfileMain = () => {

    const { id, userId } = useParams(); // Assuming id is friend.userId and uid is friend.id
    const [user, setUser] = useState(null);

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

    if (!user) {
        return <>
            <div className='skeleton-center bg-light_0 dark:bg-dark'>
                <CircularProgress className='circularprogress' />
            </div>
        </>;
    }
    return (
        <>
            <LeftArro />

            <div className='current-user-friend-profile-main bg-light_0 dark:bg-dark'>
                <div style={{ width: "100%", height: "100vh" , boxSizing: "border-box", overflowY: "scroll" }}>
                    <ProfilePageOne user={user} />
                    <ProfilePageTwo user={user} userId={userId} />
                    <ProfilePageThree user={user} />
                </div>
            </div>
        </>
    )
}

export default CurrentUserFriendProfileMain
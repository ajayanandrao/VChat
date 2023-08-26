import React, { useEffect, useState } from 'react'
import "./CurrentUserFriendProfileMain.scss";

import ProfilePageOne from './../Params/UserProfilePages/ProfilePageOne';

import { CircularProgress } from '@mui/material';
import ProfilePageTwo from '../Params/UserProfilePages/ProfilePageTwo';
import ProfilePageThree from '../Params/UserProfilePages/ProfilePageThree';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';


const LeftArro = () => {
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }
    return (
        <div className='back-btn-div' onClick={goBack}>
            <HiOutlineArrowSmLeft fontSize={"25px"} />
        </div>
    )
}

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
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div>
        </>;
    }
    return (
        <>
            <LeftArro />

            <div className='current-user-friend-profile-main'>
                <ProfilePageOne user={user} />
                <ProfilePageTwo user={user} userId={userId} />
                <ProfilePageThree user={user} />

            </div>
        </>
    )
}

export default CurrentUserFriendProfileMain
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../Firebase';
import ProfilePageOne from './UserProfilePages/ProfilePageOne';
import ProfilePageTwo from './UserProfilePages/ProfilePageTwo';
import ProfilePageThree from './UserProfilePages/ProfilePageThree';
import { CircularProgress } from '@mui/material';

import "./UserProfilePage.scss";
import { HiOutlineArrowSmLeft } from 'react-icons/hi';

const UsersProfilePage = () => {
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
                <CircularProgress className='circularprogress' />
            </div>
        </>;
    }
    return (
        <>
            {/* <LeftArro /> */}
            <div className="UserDetails-bg-container w3-animate-opacity">
                <ProfilePageOne user={user} />
                <ProfilePageTwo user={user} userId={userId} />
                <ProfilePageThree user={user} />
                <div className='height'></div>
            </div>
        </>
    )
}

export default UsersProfilePage;

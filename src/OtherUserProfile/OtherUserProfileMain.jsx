import React, { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material';

import ProfileOne from '../Params/Component/ProfileOne';
import ProfileTwo from '../Params/Component/ProfileTwo';
import ProfileThree from '../Params/Component/ProfileThree';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate, useParams } from 'react-router-dom';
import "./OtherUserProfileMain.scss";
import LeftArro from '../LeftArro';


const OtherUserProfileMain = () => {
    const { id } = useParams();
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
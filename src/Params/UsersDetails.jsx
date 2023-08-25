import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import "./UsersDetails.scss";
import ProfileOne from './Component/ProfileOne';
import ProfileTwo from './Component/ProfileTwo';
import ProfileThree from './Component/ProfileThree';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';

const UsersDetails = () => {

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
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
        </div >
        </>;
    }
return (

    <>
        <div className="UserDetails-bg-container w3-animate-opacity">
            <ProfileOne user={user} />
            <ProfileTwo user={user} />
            <ProfileThree user={user} />
        </div>
    </>

)

}




export default UsersDetails


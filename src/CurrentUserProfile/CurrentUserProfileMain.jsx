import React, { useContext, useEffect, useState } from 'react'
import "./../UserProfile/UserProfile.scss";
import "./CurrentUserProfileMain.scss";

import UserProfileOne from "./../UserProfile/Component/UserProfileOne";

import UserProfileTwo from "./../UserProfile/Component/UserProfileTwo";

import UserProfileThree from "./../UserProfile/Component/UserProfileThree";

import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import LeftArro from '../LeftArro';



const CurrentUserProfileMain = () => {

    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    return (
        <div className='current-user-profile-main'>
            <LeftArro />

            {api.map((item) => {
                if (currentUser.uid === item.uid) {
                    return (
                        <div key={item.id}>
                            <UserProfileOne user={item} />
                            <UserProfileTwo user={item} />
                        </div>
                    )
                }
            })}
            <UserProfileThree />

        </div>
    )
}

export default CurrentUserProfileMain
import React, { useContext, useEffect, useState } from 'react'
import "./UserProfile.scss";
import UserProfileOne from "./Component/UserProfileOne";
import UserProfileTwo from "./Component/UserProfileTwo";
import UserProfileThree from "./Component/UserProfileThree";
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import { useNavigate } from 'react-router-dom';
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


const UserProfile = () => {

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
        <>
            <LeftArro />
            <div className='userProfile-container w3-animate-opacity'>

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
                <div className='bottom-margin'></div>
            </div>
        </>
    )
}

export default UserProfile

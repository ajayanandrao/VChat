import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import MobileNavbarBottom from './MobileNavbarBottom';
import { AuthContext } from '../AuthContaxt';

const BottomNav = () => {
    const { currentUser } = useContext(AuthContext);

    const [api, setApiData] = useState([]);

    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));
        const userlist = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setApiData(newbooks);
            })
        };
        return userlist();
    }, []);


    return (
        <div>

            <MobileNavbarBottom  />

            {/* {api.map((item) => {
                return (
                    <>
                    </>
                )
            })} */}

        </div>
    )
}

export default BottomNav
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import Reals from './Reals';
import { AuthContext } from '../AuthContaxt';

const ReelsProps = () => {
    const [api, setApiData] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setApiData(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const newData = api.map((item) => {
        return (
            <div key={item.id}>
                <Reals CurrentUser={currentUser} post={item} />
            </div>
        );
    });

    return (
        <>
            <Reals />
        </>
    )
}

export default ReelsProps

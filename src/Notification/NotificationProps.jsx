import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import Notification from './Notification';
import { AuthContext } from '../AuthContaxt';

const NotificationProps = () => {
    const { currentUser } = useContext(AuthContext);

    const [api, setApiData] = useState([]);
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

    const Data = api.map((item) => {
        if (currentUser && currentUser.uid === item.uid) {
            return (
                <div key={item.id}>
                    <Notification post={item} />
                </div>
            );
        }
        return null;
    });

    return (
        <div style={{ padding: "20px 1rem" }}>
            {
                api.map((item) => {
                    if (currentUser && currentUser.uid === item.uid) {
                        return (
                            <div key={item.id}>
                                <Notification post={item} postLike={item.likes} />
                            </div>
                        );
                    }
                    return null;
                })
            }
        </div>
    )
}

export default NotificationProps

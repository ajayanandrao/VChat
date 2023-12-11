import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
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

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await updateDoc(PresenceRefOnline, {
                    status: 'Offline',
                    presenceTime: new Date(),
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

    const newData = api.map((item) => {
        return (
            <div key={item.id}>
                <Reals CurrentUser={currentUser} post={item} />
            </div>
        );
    });

    return (
        <div style={{ textAlign: "center" }}>
            {/* <h2>Working on it</h2> */}
            <Reals />
        </div>
    )
}

export default ReelsProps

import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import PostComponent from './PostComponent';

const PostComponentProps = () => {

    const [api, setApiData] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const colRef = collection(db, 'AllPosts');
    const q = query(colRef, orderBy('bytime', 'desc'));
    const [docs, loading, error] = useCollectionData(q, orderBy('bytime', 'desc'));

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


    return (
        <div> {
            api.map((item) => {

                return (
                    <div key={item.id}>
                        <PostComponent post={item} postLike={item.likes} />
                    </div>
                );


            })
        }</div >
    )
}

export default PostComponentProps
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../../Firebase';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import ViewStory from './ViewStory';

const ViewStoryProps = () => {
    const [stories, setStories] = useState([]);
    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
        });

        return () => unsubscribe();
    }, []);

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
        return (
            <>
                <div className="skeleton-center">
                    <CircularProgress className="circularprogress" />{' '}
                    <span className="loadinga"> Loading... </span>
                </div>
            </>
        );
    }

    const Data = stories.map((item) => {
        if (item.uid === user.uid) {
            return (
                <ViewStory post={item} />
            )
        }
    })

    return (
        <>
            {Data}
        </>
    )
}

export default ViewStoryProps

import React, { useContext, useEffect, useState } from 'react'
import "./Home.scss";
import Post from '../Post/Post';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FlipMove from 'react-flip-move';
import { Height } from '@mui/icons-material';
import { AiOutlineArrowUp } from "react-icons/ai";
// import StoryForm from '../Story/StoryForm';
import { CircularProgress } from '@mui/material';
import Feed from '../Feed/Feed';
import MobileNavebar from '../MobileNavbar/MobileNavebar';

const Home = () => {
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

    const newData = api.map((item) => {
        return (
            <div key={item.id}>
                <Feed CurrentUser={currentUser} post={item} />
            </div>
        );
    });


    const [stories, setStories] = useState([]);

    const StoryRef = collection(db, 'stories');

    useEffect(() => {
        const unsub = () => {
            onSnapshot(StoryRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setStories(newbooks);
            })
        };
        return unsub();
    }, []);


    useEffect(() => {
        // For each fetched post, check and delete if expired
        stories.forEach((story) => {
            const now = new Date();
            const diff = now - story.timestamp.toDate();
            const hoursPassed = diff / (1000 * 60 * 60); // Calculate hours passed

            if (hoursPassed > 2) {
                handleDeletePost(story.id);
            }
        });
    }, [stories]);

    const handleDeletePost = async (storyId) => {
        try {
            const postRef = doc(db, 'stories', storyId);
            // Delete the post
            await deleteDoc(postRef);
            // Optionally, you can delete associated comments, likes, etc., if required
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    

    return (
        <>
            {loading ? (
                <div className='skeleton-center'>
                    <CircularProgress className='circularprogress' /> 
                </div>
            ) : (
                <>

                    {/* <div className={`mobile-navbar ${showNavbar ? '' : 'hidden'}`}><MobileNavebar/></div> */}

                    <div className='btn' onClick={handleScrollToTop} id='scrollTopBtn'>
                        <AiOutlineArrowUp className='top-arrow' />
                    </div>
                    {/* <StoryForm /> */}
                    <Post />


                    <FlipMove>{newData}</FlipMove>
                    <div className='height'></div>
                </>
            )}


        </>
    )
}

export default Home

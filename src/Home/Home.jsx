import React, { useContext, useEffect, useState } from 'react'
import "./Home.scss";
import Post from '../Post/Post';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FlipMove from 'react-flip-move';
import { AiOutlineArrowUp } from "react-icons/ai";
import { CircularProgress } from '@mui/material';
import Feed from '../Feed/Feed';
import { motion, useAnimation } from 'framer-motion';

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
        <div className='bg-white_0 dark:bg-dark'>
            {/* <Navbar /> */}
            {loading ? (
                <div className='skeleton-center'>
                    <CircularProgress className='circularprogress' />
                </div>
            ) : (
                <>

                    {/* <div className={`mobile-navbar ${showNavbar ? '' : 'hidden'}`}><MobileNavebar/></div> */}

                    <motion.div
                        transition={{ duration: 0.3, delay: 0.8 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='btn' onClick={handleScrollToTop} id='scrollTopBtn'>
                        <AiOutlineArrowUp className='top-arrow text-black_0 dark:text-aqua_0' />
                    </motion.div>
                    {/* <StoryForm /> */}
                    <Post />


                    <FlipMove>{newData}</FlipMove>
                    <div className='height'></div>
                </>
            )}


        </div>
    )
}

export default Home

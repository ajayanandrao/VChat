import React, { useContext, useEffect, useState } from 'react'
import "./Home.scss";
import Post from '../Post/Post';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FlipMove from 'react-flip-move';
import { AiOutlineArrowUp } from "react-icons/ai";
import { CircularProgress } from '@mui/material';
import Feed from '../Feed/Feed';
import { motion, useAnimation } from 'framer-motion';
import UserMedia from '../UserProfile/Tab/UserMedia';
import Wellcome from './Wellcome';
import StoryForm from '../Story/StoryForm';
// import StoryForm from '../Story/StoryForm';

const Home = () => {
    const [api, setApiData] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const dataRef = collection(db, 'users');
    const [userPhoto, setUserPhoto] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(dataRef, (snapshot) => {
            setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);

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

    const [w, setW] = useState(false);
    const welco = async () => {
        setW(!w)
    };



    const [welcome, setWelcome] = useState([]);

    const welcomeRef = collection(db, 'Wellcome');

    useEffect(() => {
        const unsub = () => {
            onSnapshot(welcomeRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setWelcome(newbooks);
            })
        };
        return unsub();
    }, []);

    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const friendsRef = collection(db, `allFriends/${currentUser && currentUser.uid}/Friends`);
        const unsubscribe = onSnapshot(friendsRef, (friendsSnapshot) => {
            const friendsData = friendsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFriendsList(friendsData);
        }, (error) => {
            console.error('Error fetching friends:', error);
        });

        return () => unsubscribe();
    }, [currentUser && currentUser]);

    return (
        <>

            {welcome.map((item) => {

                if (item.uid === currentUser.uid) {
                    return (
                        <div style={{ color: "black", fontSize: "18px" }}>
                            {item.seen === "WelcomFalse" ? <Wellcome currentUser={currentUser} welco={welco} /> :

                                (

                                    <div className='bg-light_0 dark:bg-dark' style={{ transition: "0.8s ease-in-out" }}>
                                        {loading ? (
                                            <div className='skeleton-center bg-light_0 dark:bg-dark'>
                                                <CircularProgress className='circularprogress' />
                                            </div>
                                        ) : (
                                            <>
                                                <motion.div
                                                    transition={{ duration: 0.3, delay: 0.8 }}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className='btn' onClick={handleScrollToTop} id='scrollTopBtn'>
                                                    <AiOutlineArrowUp className='top-arrow text-aqua_0 ' />
                                                </motion.div>

                                                <StoryForm />

                                                <Post />

                                                <FlipMove>{newData}</FlipMove>
                                                {/* <div className='height'></div> */}
                                            </>
                                        )}

                                    </div>

                                )


                            }
                        </div>
                    )
                }
            })}


        </>
    )
}

export default Home

import React, { useContext, useEffect, useState } from 'react'
import "./StoryForm.scss";
import { db, storage } from '../Firebase';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { v4, uuidv4 } from "uuid";
import { AuthContext } from '../AuthContaxt';
import "./../Styles/flikity.scss";
import { Link } from 'react-router-dom';

const StoryForm = () => {
    const { currentUser } = useContext(AuthContext);

    const dataRef = collection(db, "users");
    const [userPhoto, setUserPhoto] = useState(null);
    useEffect(() => {
        const unsub = onSnapshot(dataRef, (snapshot) => {
            setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);

    const [stories, setStories] = useState([]);
    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true), orderBy("timestamp", 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
        });

        return () => unsubscribe();
    }, []);

    const handleViewStory = async (storyId) => {
        const storyRef = doc(db, 'stories', storyId);

        try {
            // Get the story document
            const storyDoc = await getDoc(storyRef);
            const storyData = storyDoc.data();

            // Get the users who have viewed the story
            const viewedBy = storyData.viewedBy || [];

            // Check if the current user has already viewed the story
            if (!viewedBy.includes(currentUser.uid)) {
                viewedBy.push(currentUser.uid);
                await updateDoc(storyRef, { viewedBy: viewedBy });
            }
        } catch (error) {
            console.error('Error updating story visibility:', error);
        }
    };

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

    const newuid = friendsList.find((item) => item.uid)




    return (
        <>
            <div className="card-container">


                {stories.length > 0 ?
                    <div className="status-card-wrapper bg-lightDiv dark:bg-darkDiv">

                        {stories.map((story) => {

                            if (story.uid !== currentUser.uid) {
                                return (
                                    <div key={story.id}>

                                        {friendsList.map((item) => {

                                            if (story.uid === item.uid) {
                                                return (
                                                    <>
                                                        {!story.viewedBy || !story.viewedBy.includes(currentUser.uid) ? (
                                                            <>
                                                                <Link to={`/users/${story.uid}/story`} onClick={() => handleViewStory(story.id)}>
                                                                    <div>
                                                                        {story.image && story.image.includes('.mp4') ? (
                                                                            <div className="status-video-div">
                                                                                <video className="status-video" id="video" loop muted >
                                                                                    <source src={story.image} type="video/mp4" />
                                                                                </video>
                                                                                <img className='story-profile-img' src={story.photoUrl} alt="" />
                                                                                <div className='new-status-blink  animate-blinkStatus'></div>
                                                                            </div>
                                                                        ) : (

                                                                            <div className="status-card-div" style={{
                                                                                backgroundImage:
                                                                                    `url(${story.image})`
                                                                            }}>
                                                                                <img className='story-profile-img' src={story.photoUrl} alt="" />
                                                                                <div className='new-status-blink  animate-blinkStatus'></div>
                                                                            </div>
                                                                        )}
                                                                    </div>


                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Link to={`/users/${story.uid}/story`} onClick={() => handleViewStory(story.id)}>
                                                                    <div>
                                                                        {story.image && story.image.includes('.mp4') ? (
                                                                            <>
                                                                                <div className="status-video-div">
                                                                                    <video className="status-video" id="video" loop muted >
                                                                                        <source src={story.image} type="video/mp4" />
                                                                                    </video>
                                                                                    <img className='story-profile-img' style={{ border: "2px solid white " }} src={story.photoUrl} alt="" />
                                                                                </div>
                                                                            </>

                                                                        ) : (
                                                                            <>


                                                                                <div className="status-card-wrapper">
                                                                                    <div className="status-card-div" style={{
                                                                                        backgroundImage:
                                                                                            `url(${story.image})`
                                                                                    }}>
                                                                                        <img className='story-profile-img' style={{ border: "2px solid white " }} src={story.photoUrl} alt="" />
                                                                                    </div>
                                                                                </div>

                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </Link>
                                                            </>
                                                        )}

                                                    </>
                                                )
                                            }

                                        })}


                                    </div>
                                )
                            }
                        })}

                    </div >
                    :
                    null
                }

                {/* <div className="c-card"></div> */}
            </div >
        </>
    )
}

export default StoryForm

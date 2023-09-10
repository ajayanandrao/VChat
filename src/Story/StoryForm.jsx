import React, { useContext, useEffect, useState } from 'react'
import "./StoryForm.scss";
import { db, storage } from '../Firebase';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { v4, uuidv4 } from "uuid";
import { AuthContext } from '../AuthContaxt';
import Flickity from 'react-flickity-component';
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
        const q = query(storiesCollection, where('visible', '==', true));

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

    const filteredStories = stories.filter(story => story.uid !== currentUser.uid).slice(0, 3);

    return (
        <>
            <div className="card-container">

                <Link to="/createStory/">
                    <div className="story-div"
                        style={{
                            backgroundImage:
                                `url(${currentUser && currentUser.photoURL})`
                        }}>
                        <div className="add-story-div">
                            <i className="bi bi-plus-circle-fill add-plus"></i>
                        </div>
                    </div>
                </Link>


                {filteredStories.map((story) => {

                    if (story.uid !== currentUser.uid) {
                        return (
                            <div key={story.id}>

                                {!story.viewedBy || !story.viewedBy.includes(currentUser.uid) ? (
                                    <>
                                        <Link to={`/users/${story.uid}/story`} onClick={() => handleViewStory(story.id)}>
                                            {/* <div className="story-div story-div-border" style={{
                                                backgroundImage:
                                                    `url(${story.image})`
                                            }} >
                                                <img className='story-profile-img' src={story.photoUrl} alt="" />
                                            </div> */}

                                            <div>
                                                {story.image && story.image.includes('.mp4') ? (
                                                    <div className="story-video-container ">
                                                        <video className="story-video story-div-border" id="video" loop muted >
                                                            <source src={story.image} type="video/mp4" />
                                                        </video>
                                                        <div className='video-inner'>
                                                            <img className='story-profile-img' src={story.photoUrl} alt="" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="story-div story-div-border" style={{
                                                        backgroundImage:
                                                            `url(${story.image})`
                                                    }} >
                                                        <img className='story-profile-img' src={story.photoUrl} alt="" />
                                                    </div>
                                                )}
                                            </div>


                                        </Link>
                                    </>
                                    // <button onClick={() => handleViewStory(story.id)}>View Story</button>
                                ) : (
                                    <>
                                        <Link to={`/users/${story.uid}/story`} onClick={() => handleViewStory(story.id)}>
                                            <div>
                                                {story.image && story.image.includes('.mp4') ? (
                                                    <div className="story-video-container ">
                                                        <video className="story-video" id="video" loop muted >
                                                            <source src={story.image} type="video/mp4" />
                                                        </video>
                                                        <div className='video-inner'>
                                                            <img className='story-profile-img' src={story.photoUrl} alt="" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="story-div " style={{
                                                        backgroundImage:
                                                            `url(${story.image})`
                                                    }} >
                                                        <img className='story-profile-img' src={story.photoUrl} alt="" />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )
                    }
                })}


                {/* <div className="c-card"></div> */}
            </div>
        </>
    )
}

export default StoryForm

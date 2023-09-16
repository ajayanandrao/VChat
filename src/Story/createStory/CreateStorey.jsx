import React, { useContext, useEffect, useRef, useState } from 'react';
import { db, storage } from './../../Firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 } from "uuid";
import { AuthContext } from './../../AuthContaxt';
import ReactTimeago from 'react-timeago';
import { FaPlay } from 'react-icons/fa';
import v1 from "./../../Image/sv.mp4";
// import ReactPlayer from 'react-player';
import "./CreateStory.scss"
import { LinearProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHeart } from 'react-icons/ai';
import { BsFillChatFill } from 'react-icons/bs';

function TimeAgoComponent({ timestamp, onDelete }) {
    useEffect(() => {
        const checkTimePassed = () => {
            const now = new Date();
            const diff = now - new Date(timestamp);

            const hoursPassed = diff / (1000 * 60 * 60); // Calculate hours passed

            if (hoursPassed > 2) { // Check if 2 or more hours have passed
                onDelete();
            }
        };

        const timer = setInterval(checkTimePassed, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [timestamp, onDelete]);

    return <ReactTimeago date={timestamp} />;
}



const CreateStorey = () => {
    const { currentUser } = useContext(AuthContext);
    const [stories, setStories] = useState([]);
    const [newStoryImage, setNewStoryImage] = useState(null);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const handleAddStory = async () => {
        if (!newStoryImage) {
            alert('Please select an image.');
            return;
        }
        setNewStoryImage(null);
        const storiesCollection = collection(db, 'stories');
        let downloadURL;

        try {
            const querySnapshot = await getDocs(
                query(storiesCollection, where('uid', '==', currentUser.uid))
            );

            if (querySnapshot.size > 0) {
                const docRef = querySnapshot.docs[0].ref;
                const storageRef = ref(storage, `story_images/${newStoryImage.name}`);

                const uploadTask = uploadBytesResumable(storageRef, newStoryImage);

                uploadTask.on('state_changed', (snapshot) => {
                    // Get the progress percentage
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload progress: ${progress}%`);
                });

                await uploadTask;

                downloadURL = await getDownloadURL(storageRef);

                await updateDoc(docRef, {
                    image: downloadURL,
                    timestamp: serverTimestamp(),
                });
            } else {
                const storageRef = ref(storage, `story_images/${newStoryImage.name}`);

                const uploadTask = uploadBytesResumable(storageRef, newStoryImage);

                uploadTask.on('state_changed', (snapshot) => {
                    // Get the progress percentage
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload progress: ${progress}%`);
                    if (progress < 100) {
                        document.getElementById("p1").style.display = "block";
                    } else {
                        document.getElementById("p1").style.display = "none";
                    }
                });

                await uploadTask;

                downloadURL = await getDownloadURL(storageRef);

                await addDoc(storiesCollection, {
                    name: newStoryImage ? newStoryImage.name : '',
                    image: newStoryImage ? downloadURL : '',
                    uid: currentUser && currentUser.uid,
                    photoUrl: currentUser.photoURL,
                    visible: true,
                    timestamp: serverTimestamp(),
                });
            }

            setStories([...stories, { image: downloadURL }]);
            setNewStoryImage(null);

        } catch (error) {
            console.error('Error adding/updating story:', error);
        }
    };

    const deleteStory = async (storyId) => {
        try {
            const storyRef = doc(db, 'stories', storyId);
            const likesQuerySnapshot = await getDocs(
                collection(db, 'stories', storyId, 'likes')
            );
            const commentQuerySnapshot = await getDocs(
                collection(db, 'stories', storyId, 'comments')
            );

            // Delete the story
            await deleteDoc(storyRef);

            // Delete the corresponding likes
            likesQuerySnapshot.forEach(async (doc) => {
                const likeRef = doc.ref;
                await deleteDoc(likeRef);
            });
            commentQuerySnapshot.forEach(async (doc) => {
                const likeRef = doc.ref;
                await deleteDoc(likeRef);
            });
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    };

    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
        });

        return () => unsubscribe();
    }, []);

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handleClick = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const [comments, setComments] = useState([]);
    const fetchComments = async (storyId) => {
        try {
            const commentsCollection = collection(db, 'stories', storyId, 'comments');
            const querySnapshot = await getDocs(query(commentsCollection, orderBy('commentTime', 'desc')));
            const fetchedComments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setComments((prevComments) => [...prevComments, ...fetchedComments]);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
            fetchedStories.forEach((story) => {
                fetchComments(story.id);
                fetchLike(story.id);
            });
        });

        return () => unsubscribe();
    }, []);

    const [like, setLike] = useState([]);
    const fetchLike = async (storyId) => {
        try {
            const likeCollection = collection(db, 'stories', storyId, 'likes');
            const querySnapshot = await getDocs(query(likeCollection));
            const fetchLike = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setLike(fetchLike);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const filteredComments = comments.filter((item) => item.storyUid === currentUser.uid);
    const Like = like.filter((item) => currentUser.uid === item.storyUid);

    const [storyUid, setStoryUid] = useState(null);



    useEffect(() => {
        const sub = () => {
            const userStory = stories.find(item => item.uid === currentUser?.uid);
            if (userStory) {
                setStoryUid(userStory.uid);
            }
        };

        sub(); // Call the function immediately

        return () => {
            // Clean up code here if necessary
        };
    }, [currentUser, stories]);

    const [showLikes, setShowLikes] = useState(false);
    const HandleShowLike = () => {
        setShowLikes(!showLikes)
        if (showComment === true) {
            setShowComment(false);
        }

    }
    // Comment

    const [showComment, setShowComment] = useState(false);
    const HandleShowComment = () => {
        setShowComment(!showComment)
        if (showLikes === true) {
            setShowLikes(false);
        }

    }

    return (
        <>
            <LinearProgress id="p1" style={{ display: "none" }} />


            {storyUid ?

                (
                    <>
                        <div className='story-div'>
                            {stories.map((story) => {

                                if (story.uid === currentUser.uid) {
                                    return (
                                        <div key={story.id}>
                                            {story.image && story.image.includes('.mp4') ? (
                                                <div className="video-container">
                                                    <video ref={videoRef} onClick={handleClick} className="video" id="video" autoPlay>
                                                        <source src={story.image} type="video/mp4" />
                                                    </video>
                                                </div>
                                            ) : (
                                                <div className='story-img-div'>

                                                    {showLikes ? (
                                                        <div className="userLikes-div">
                                                            <div>
                                                                <div>
                                                                    {like.map((like) => {
                                                                        return (
                                                                            <div className=''>
                                                                                <div className="liked-user-profile">
                                                                                    <div>
                                                                                        <img className="liked-user-profile-img" src={like.photoURL} alt="" />
                                                                                    </div>
                                                                                    <div>{like.name}</div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                        :
                                                        null}

                                                    {showComment ? (
                                                        <div className="userLikes-div">
                                                            <div>
                                                                <div>
                                                                    {filteredComments.map((like) => {
                                                                        return (
                                                                            <div className='d-flex'>
                                                                                <div className="commented-user-profile">
                                                                                    <div>
                                                                                        <img src={like.photoURL} className="liked-user-profile-img" alt="" />
                                                                                    </div>
                                                                                    <div>{like.comment}</div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                        :
                                                        null}




                                                    <img src={story.image} className='story-img' alt="Story" />

                                                    <div className="story-like-div" onClick={() => HandleShowLike()}>
                                                        <div className='mx-2' style={{ color: "white", fontSize: "14px" }} >
                                                            {Like.length}
                                                        </div>
                                                        <AiFillHeart style={{ color: "red", fontSize: "24px" }} />
                                                    </div>

                                                    <div className="story-comment-div" onClick={() => HandleShowComment()}>
                                                        <div className='mx-2' style={{ color: "white", fontSize: "14px" }} >
                                                            {filteredComments.length}
                                                        </div>
                                                        <BsFillChatFill style={{ color: "#FFFFFF", fontSize: "24px" }} />
                                                    </div>
                                                    <div className="story-delete-div" onClick={() => HandleShowComment()}>
                                                        <BsFillChatFill style={{ color: "#FFFFFF", fontSize: "24px" }} />
                                                    </div>
                                                </div>
                                            )}



                                        </div>
                                    );
                                }
                            })}
                        </div>

                    </>
                )
                :
                (<>
                    <div className='story-mainu'>
                        <input
                            style={{ display: "none" }}
                            className='my-2 story-add-input'
                            id='Add-story'
                            type="file"
                            onChange={(e) => setNewStoryImage(e.target.files[0])}
                            accept="image/*, video/*"
                        />

                        <div className='btn-inline'>
                            <label htmlFor="Add-story">
                                <div className='folder'>📂</div>
                            </label>
                            <button className=' btn-primary-custom' onClick={handleAddStory}>
                                Add Story
                            </button>

                        </div>
                    </div>
                </>)}

            {newStoryImage && newStoryImage.type.startsWith('image/') && (
                <img className="story-img" src={URL.createObjectURL(newStoryImage)} alt="" />
            )}

            {newStoryImage && newStoryImage.type.startsWith('video/') && (
                <div className="story-img">
                    <video ref={videoRef} onClick={handleClick} className="video ">
                        <source src={URL.createObjectURL(newStoryImage)} type={newStoryImage.type} />
                    </video>
                </div>
            )}






        </>
    );
};

export default CreateStorey;

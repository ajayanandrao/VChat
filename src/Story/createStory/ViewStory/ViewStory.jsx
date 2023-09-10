import React, { useContext, useEffect, useState, useRef } from 'react';
import './ViewStory.scss';
import { AuthContext } from '../../../AuthContaxt';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, LinearProgress } from '@mui/material';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { MdClose } from 'react-icons/md';
import { AiFillHeart, AiOutlineHeart, AiOutlineSend } from 'react-icons/ai';
import { styled } from '@mui/material/styles';
import { v4, uuidv4 } from "uuid";


const ViewStory = ({ post }) => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };

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

    const [countdown, setCountdown] = useState(20);
    const [showContainer, setShowContainer] = useState(true);
    const progressRef = useRef(0);
    const [stories, setStories] = useState([]);

    const [liked, setLiked] = useState(false);
    const [like, setLike] = useState([]);
    const [isliked, setIsliked] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowContainer(false);
        }, 20000);

        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(countdownInterval);
        };
    }, []);

    useEffect(() => {
        if (countdown <= 0) {
            goBack();
        }
    }, [countdown, goBack]);

    useEffect(() => {
        const progressIncrement = 100 / 20; // Increment value for each second
        const progressInterval = setInterval(() => {
            progressRef.current += progressIncrement;
            if (progressRef.current >= 100) {
                progressRef.current = 100;
                clearInterval(progressInterval);
            }
        }, 1000);

        return () => {
            clearInterval(progressInterval);
        };
    }, []);


    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 5,
        borderRadius: 5,
    }));

    // ----------------


    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'stories', post.id, 'likes')),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
                // Log the uid property of each document
            }
        );

        return unsubscribe;
    }, [post.id]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "stories", post.id, "likes"),
            (snapshot) => setLike(snapshot.docs)
        );
        return () => {
            unsub();
        };
    }, [post.id]);


    useEffect(() => {
        setLiked(like.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [like, currentUser.uid]);


    const handleLike = async (id) => {
        if (currentUser && currentUser.uid) {
            const likeRef = doc(db, "stories", id, "likes", currentUser.uid);
            const likeDoc = await getDoc(likeRef);

            if (likeDoc.exists()) {
                await deleteDoc(likeRef);
            } else {
                await setDoc(likeRef, {
                    storyUid: user.uid,
                    userId: currentUser.uid,
                    name: currentUser.displayName
                });
            }
        }
    };

    const [storyLike, setStoryLike] = useState([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'stories', post.id, 'likes')),
            (snapshot) => {
                setStoryLike(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
                // Log the uid property of each document
            }
        );

        return unsubscribe;
    }, [post.id]);

    // comment

    const [storyComment, setStoryComment] = useState("");

    const handleStoryComment = async (id) => {
        if (!storyComment) {
            alert("Please enter a story comment");
            return;
        }
        await addDoc(collection(db, 'stories', id, 'comments'), {
            comment: storyComment,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            storyUid: user.uid,
            commentTime: serverTimestamp(),
        });

        setStoryComment("");
    }


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

    return (
        <>
            {
                storyLike.map((item) => (
                    <p key={item.id}>{item.name}</p>
                ))
            }

            {showContainer && (

                stories.map((story) => {
                    if (user.uid === story.uid) {
                        return (
                            <div key={story.id} >
                                {story.image && story.image.includes('.mp4') ? (
                                    <div className="view-video-container">
                                        <video ref={videoRef} onClick={handleClick} className="view-video" id="video" autoPlay  >
                                            <source src={story.image} type="video/mp4" />
                                        </video>
                                        <BorderLinearProgress
                                            variant="determinate"
                                            value={progressRef.current} // Use the current progress value
                                            style={{ width: '100%', color: "red" }}
                                            className="view-countdown-progress"
                                        />
                                        <div className='video-inner-container'>
                                            <img src={user.userPhoto} className="video-view-profile-img" alt="" />
                                            <div className="video-view-profile-name">{user.name}</div>

                                            <div className="video-view-profile-close-div">
                                                <MdClose className="video-view-close-btn" onClick={goBack} />
                                            </div>

                                            <div className="video-view-Profile-bottom-div">
                                                <input type="text" placeholder="Replay to"
                                                    className="video-view-input"
                                                    onChange={(e) => setStoryComment(e.target.value)}
                                                    value={storyComment}
                                                />

                                                {/* <AiFillHeart
                                                    onClick={() => handleLike(story.id)}
                                                    className="video-view-send-icon  "
                                                /> */}
                                                {liked ? < AiFillHeart className="video-view-send-icon  " style={{ color: "#FF0040" }} onClick={() => handleLike(story.id)} /> :
                                                    <AiOutlineHeart className="video-view-send-icon  " onClick={() => handleLike(story.id)} />}


                                                < AiOutlineSend className="video-view-send-icon"
                                                    onClick={() => handleStoryComment(story.id)}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                ) : (

                                    <div
                                        className="view-main-container"
                                        style={{
                                            backgroundImage: `url(${story.image})`,
                                        }}
                                    >
                                        <BorderLinearProgress
                                            variant="determinate"
                                            value={progressRef.current} // Use the current progress value
                                            style={{ width: '100%', color: "red" }}
                                            className="view-countdown-progress"
                                        />

                                        <div className="view-profile-div">
                                            <img src={user.userPhoto} className="view-profile-img" alt="" />
                                            <div className="view-profile-name">{user.name}</div>

                                            <div className="view-profile-close-div">
                                                <MdClose className="view-close-btn" onClick={goBack} />
                                            </div>

                                            <div className="view-Profile-bottom-div">
                                                <input type="text" placeholder="Replay to"
                                                    className="view-input"
                                                    onChange={(e) => setStoryComment(e.target.value)}
                                                    value={storyComment}
                                                />


                                                {/* <AiFillHeart
                                                    onClick={() => handleLike(story.id)}
                                                    className="view-send-icon "
                                                /> */}
                                                {liked ? < AiFillHeart className="view-send-icon " onClick={() => handleLike(story.id)} /> :
                                                    <AiOutlineHeart className="view-send-icon " onClick={() => handleLike(story.id)} />}

                                                <AiOutlineSend className="view-send-icon"
                                                    onClick={() => handleStoryComment(story.id)}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )
                    }
                })

            )
            }
        </>
    );
};

export default ViewStory;

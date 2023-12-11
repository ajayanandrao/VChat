import { CircularProgress, Tabs } from '@mui/material';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../Firebase';
import "./NotificationParam.scss";
import { FaPlay } from 'react-icons/fa';
import { BsFillChatDotsFill, BsFillHeartFill } from 'react-icons/bs';
import ReactTimeago from 'react-timeago';
import { CgClose } from "react-icons/cg"
import { AiFillHeart } from 'react-icons/ai';
import { IoMdSend } from 'react-icons/io';
import { AuthContext } from '../AuthContaxt';
import { BiSend, BiSolidSend } from 'react-icons/bi';

const NotificationPara = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const nav = useNavigate();

    const goBack = () => {
        nav(-1);
    }

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await deleteDoc(PresenceRefOnline);
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

    const [newComment, setNewComment] = useState("");
    const HandleComment = async () => {
        // e.preventDefault();

        if (!newComment) {
            return;
        }
        setNewComment('');


        // Adding a comment to the 'comments' collection under a specific post
        await addDoc(collection(db, 'AllPosts', api.id, 'comments'), {
            comment: newComment,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            commentTime: serverTimestamp(),
        });

        // Adding a notification to the 'Notification' collection under the same post
        await addDoc(collection(db, 'AllPosts', id, 'Notification'), {
            comment: newComment,
            com: "comment",
            name: currentUser.displayName,
            photoUrl: currentUser.photoURL,
            uid: currentUser.uid,
            time: serverTimestamp(),
        });

        // Clearing the comment input field after adding the comment and notification
        setNewComment('');
    };

    const deleteComment = (id) => {
        const CommentRf = doc(db, 'AllPosts', api.id, "comments", id)
        deleteDoc(CommentRf);
        console.log("deleted Comment of id :" + api.id);
    };

    const handleVideoBtnClick = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const [isLoading, setIsLoading] = useState(true);
    const [api, setApiData] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'AllPosts', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setApiData({ id: userDocSnapshot.id, ...userDocSnapshot.data() });

                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);


    const [comment, setComment] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', id, 'comments'),
                orderBy('commentTime', "desc")
            ),
            (snapshot) => {
                setComment(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
        );

        return unsubscribe;
    }, [id]);


    const [isLiked, setIsliked] = useState([]);


    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', id, 'likes'),
                orderBy('time', 'desc')
            ),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
                setIsLoading(false); // Set isLoading to false when data is loaded
            }
        );

        return unsubscribe;
    }, [id]);

    function openCity(cityName) {
        var i;
        var x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById(cityName).style.display = "block";
    }

    function TimeAgoComponent({ timestamp }) {
        return <ReactTimeago date={timestamp} />;
    }
    function CommentTimeAgoComponent({ timestamp }) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

        if (diffInSeconds < 60) {
            return "just now";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min ago`;
        } else {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} h ago`;
        }
    }


    if (!api) {
        return <>
            <div className='skeleton-center bg-light_0 dark:bg-dark'>
                <CircularProgress className='circularprogress' />
            </div >
        </>
    }

    return (
        <div className='view-container bg-light_0 dark:bg-dark'>

            <div className='view-notification-inner-div'>

                <div className="view-notification-time text-lightPostText dark:text-darkPostText">
                    <TimeAgoComponent timestamp={api.bytime && api.bytime.toDate()} />
                </div>

                <div className='dark:text-[white] text-[black] text-center' >{api.postText}</div>

                {api.img && (api.name.includes('.jpg') || api.name.includes('.png')) ? (
                    <img src={api.img} alt="Uploaded" className="view-Post-img" />
                ) : api.img ? (

                    <div className="view-video-container">
                        <video ref={videoRef} className="view-notification-post-video" onClick={handleVideoBtnClick}>
                            <source src={api.img} type="video/mp4" />
                        </video>
                        {!isPlaying && (
                            <div className="intro-banner-vdo-play-btn-noti-Comment" onClick={handleVideoBtnClick}>
                                <div className="play-button" >
                                    <FaPlay className='play-button' />
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}

                <div className="view-tab-make-comment-inner-div text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv">
                    <input
                        type="text"
                        placeholder='write a Comment'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className='view-tab-make-comment-input text-lightPostText   dark:bg-darkDiv dark:text-darkProfileName'
                    />
                    <div >
                        {newComment ?
                            <BiSolidSend className='view-tab-make-comment-icon ' color='#0080FF' onClick={() => { HandleComment(); openCity('comment') }} />
                            :
                            <BiSend className='view-tab-make-comment-icon dark:text-darkPostIcon' onClick={() => { HandleComment(); openCity('comment') }} />
                        }
                    </div>
                </div>

                {comment && comment.map((item) => {
                    return (
                        <div key={item.id}>
                            <div className="notification-container">
                                <div>
                                    <img src={item.photoURL} className='notification-comment-profile-image' alt="" />
                                </div>

                                <div className="notification-comment-profile-group">
                                    <div className='bg-lightDiv dark:bg-darkDiv' style={{ padding: "5px 10px", borderRadius: "10px" }} >
                                        <div className="notification-comment-profile-group-name">
                                            <span style={{ textTransform: "capitalize", fontWeight: "600" }} className='text-lightProfileName dark:text-darkProfileName'>
                                                {item.displayName}</span>
                                        </div>
                                        <span className='comment-api text-lightPostText dark:text-darkPostText' >{item.comment}</span>
                                    </div>
                                    <div className='view-noti-post-time text-lightPostTime dark:text-darkPostTime'>
                                        <CommentTimeAgoComponent timestamp={item.commentTime && item.commentTime.toDate()} />
                                    </div>
                                </div>

                                <div className='view-comment-delte-container'>
                                    {currentUser && currentUser.uid == item.uid ?
                                        <div className="view-comment-delete-div text-lightPostText dark:text-darkPostText">
                                            <CgClose onClick={() => deleteComment(item.id)} />
                                        </div>
                                        :
                                        ""
                                    }
                                </div>

                            </div>
                        </div>
                    )
                })}

                {/* {isLiked.map((like) => {
                    return (
                        <div key={like.id}>
                            <div className='noti-pro-div mb-3'>
                                <img src={like.photoUrl} className='noti-pro-img' alt="" />
                                <span style={{ textTransform: "capitalize" }} className='text-lightPostText dark:text-darkProfileName'>{like.name}</span>
                            </div>
                        </div>
                    )
                })} */}

            </div>

        </div>
    )
}

export default NotificationPara

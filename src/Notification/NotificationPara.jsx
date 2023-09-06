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
                orderBy('time', "desc")
            ),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
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
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' />
            </div >
        </>;
    }

    return (
        <div className='view-container bg-white_0 dark:bg-dark'>

            <div className='view-noti-profile-div'>
                <img src={api.photoURL} className='View-noti-profile-img' alt="" />
                <div className='view-noti-profile-name dark:text-darkProfileName'>{api.displayName}</div>
                <div className='view-noti-post-time dark:text-darkPostTime'>
                    <TimeAgoComponent timestamp={api.bytime && api.bytime.toDate()} />
                </div>
                <div className="view-noti-post-close dark:text-darkPostText">
                    <CgClose onClick={goBack} />
                </div>
            </div>

            <div className='view-profile-postText dark:text-darkPostText'>{api.postText}</div>

            <div className="view-img-wrapper">
                {api.img && (api.name.includes('.jpg') || api.name.includes('.png')) ? (
                    <img src={api.img} alt="Uploaded" className="view-Post-img" />
                ) : api.img ? (

                    <div className="view-video-container">
                        <video ref={videoRef} className="view-post-video" onClick={handleVideoBtnClick}>
                            <source src={api.img} type="video/mp4" />
                        </video>
                        {!isPlaying && (
                            <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                <div className="play-button" >
                                    <FaPlay className='play-button' />
                                </div>
                            </a>
                        )}
                    </div>
                ) : null}
            </div>

            
                <div className="view-tab-block">
                    <div className="w3-bar-item d-flex align-items-center" onClick={() => openCity('like')}>
                        <AiFillHeart style={{ color: "#FF0040", fontSize: "35px" }} />
                        <div className="view-tab-like-count dark:text-darkPostText ms-2">
                            {isLiked.length}
                        </div>
                    </div>
                    <div className="w3-bar-item d-flex align-items-center" onClick={() => openCity('comment')}>
                        <BsFillChatDotsFill style={{ color: "#6366f1", fontSize: "30px" }} />
                        <div className="view-tab-like-count dark:text-darkPostText ms-2">
                            {comment.length}
                        </div>
                    </div>
                </div >
                <div className='' style={{ width: "100%", height: "100%", boxSizing: "border-box", overflowY: "scroll" }}>
                <div className="view-tab-make-comment-div">
                    <div className="view-tab-make-comment-inner-div dark:bg-darkDiv">
                        <input
                            type="text"
                            placeholder='write a Comment'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className='view-tab-make-comment-input dark:text-darkProfileName'
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') {
                        //         e.preventDefault(); // Prevent the default "Enter" behavior (e.g., form submission)
                        //         if (getComment.trim() !== '') {
                        //             HandleComment(e, post.id);
                        //         }
                        //     }
                        // }}
                        />
                        <div >
                            {newComment ?
                                <BiSolidSend className='view-tab-make-comment-icon ' color='#0080FF' onClick={() => { HandleComment(); openCity('comment') }} />
                                :
                                <BiSend className='view-tab-make-comment-icon dark:text-darkPostIcon' onClick={() => { HandleComment(); openCity('comment') }} />
                            }
                        </div>
                    </div>

                </div>

                <div id="like" className=" w3-animate-bottom city view-container-list">
                    {isLiked.map((like) => {
                        return (
                            <div key={like.id}>
                                <div className='noti-pro-div mb-3'>
                                    <img src={like.photoUrl} className='noti-pro-img' alt="" />
                                    <span style={{ textTransform: "capitalize" }} className='dark:text-darkProfileName'>{like.name}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div id="comment" className=" w3-animate-bottom city view-container-list" style={{ display: "none" }}>

                    {comment && comment.map((item) => {
                        return (
                            <div key={item.id}>
                                <div className="notification-container">
                                    <div>
                                        <img src={item.photoURL} className='notification-comment-profile-image' alt="" />
                                    </div>

                                    <div className="notification-comment-profile-group">
                                        <div className='dark:bg-darkDiv' style={{ padding: "5px 10px", borderRadius: "10px" }} >
                                            <div className="notification-comment-profile-group-name">
                                                <span style={{ textTransform: "capitalize", fontWeight: "600" }} className='dark:text-darkProfileName'>
                                                    {item.displayName}</span>
                                            </div>
                                            <span className='comment-api dark:text-darkPostText' >{item.comment}</span>
                                        </div>
                                        <div className='view-noti-post-time dark:text-darkPostTime'>
                                            <CommentTimeAgoComponent timestamp={item.commentTime && item.commentTime.toDate()} />
                                        </div>
                                    </div>
                                    <div className='view-comment-delte-container'>
                                        {currentUser && currentUser.uid == item.uid ?
                                            <div className="view-comment-delete-div dark:text-darkPostText">
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

                </div>
            </div>

        </div>
    )
}

export default NotificationPara

import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFillChatDotsFill, BsFillHeartFill } from 'react-icons/bs';
import { FaPlay, FaShare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReactTimeago from 'react-timeago';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { IoMdSend } from 'react-icons/io';
import { BiSend, BiSolidSend } from 'react-icons/bi';
import sms from "./../../Image/img/sms.png";

const UserPostPage = ({ post }) => {
    const { currentUser } = useContext(AuthContext);
    // Video

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const handleVideoBtnClick = (id) => {
        const video = videoRef.current;
        const previewVideos = document.querySelectorAll('.video');

        // Pause all preview videos
        previewVideos.forEach((previewVideo) => {
            if (previewVideo !== video) {
                previewVideo.pause();
            }
        });

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };


    // Like

    const [like, setLike] = useState([]);
    const [liked, setLiked] = useState(false);
    const [isliked, setIsliked] = useState([]);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "AllPosts", post.id, "likes"),
            (snapshot) => setLike(snapshot.docs)
        );
        return () => {
            unsub();
        };
    }, [post.id]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'likes')),
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
        setLiked(like.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [like, currentUser.uid]);

    const [showLikedName, setShowLikedName] = useState(false);
    function showLike() {
        setShowLikedName(!showLikedName);
    }

    const Heart = async (id) => {
        handleClick();
        const element = document.getElementById(`myheart-${id}`)

        if (liked) {
            await deleteDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid));
            // element.style.color = 'white';
        } else {
            await setDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid), {
                userId: currentUser.uid,
                name: currentUser.displayName
            });
            // element.style.color = '#FF0040';
        }

    }


    function PostTimeAgoComponent({ timestamp }) {
        const postDate = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) {
            return "just now";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}min ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);

            if (days > 10) {
                const options = { day: 'numeric', month: 'short', year: 'numeric' };
                return postDate.toLocaleDateString(undefined, options);
            } else {
                return `${days}d ago`;
            }
        }
    }



    const [rightComment, setRightComment] = useState(false);
    const handleCloseRightComment = () => {
        setRightComment(false);
    };
    const handleClick = () => {
        setAnimate(!animate);
    };
    // function showLike(id) {
    //     const element = document.getElementById(`showliked-${id}`)
    //     const comment = document.getElementById(`comment-${id}`);

    //     if (element.style.display === 'none') {
    //         element.style.display = 'flex'
    //         comment.style.display = 'none';
    //     } else {
    //         element.style.display = 'none'
    //     }
    // }

    // comment 

    const [commentCount, setCommentCount] = useState(0);
    const [getComment, setComment] = useState([]);
    const [newComment, setNewComment] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, 'AllPosts', post.id, 'comments'),
                orderBy('commentTime', 'desc')
            ),
            (snap) => {
                setNewComment(
                    snap.docs.map((snap) => ({
                        id: snap.id,
                        ...snap.data(),
                    }))
                );
                setCommentCount(snap.docs.length);
            }
        );

        return unsubscribe;
    }, [post.id]);
    const handleRightComment = () => {
        setRightComment(!rightComment)
    };

    const HandleComment = async (e, id) => {
        e.preventDefault();
        if (!getComment) {
            return
        }
        // setShowEmoji(false)
        await addDoc(collection(db, 'AllPosts', id, 'comments'), {
            comment: getComment,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            commentTime: serverTimestamp(),
        });

        setComment('');
    };

    return (
        <div>
            <div className="feed-container">

                <div className="feed-div bg-lightDiv dark:bg-darkDiv">

                    <div className="feed-profile-div">
                        <img src={post.photoURL} className='feed-img' alt="" />

                        <div className="feed-profile-name text-lightProfileName dark:text-darkProfileName">
                            {post.displayName.length > 20 ? post.displayName.slice(0, 20) : post.displayName}
                        </div>

                        <div className="feed-time text-lightPostTime dark:text-darkPostTime">
                            <PostTimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} />
                        </div>

                    </div>

                    {/* Feed Text */}
                    <div className="feed-post-text d-flex text-lightPostText dark:text-darkPostText" >
                        {post.postText}
                    </div>

                    {/* Feed Photo */}
                    <div className="feed-post-container">

                        {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                            <img width={"300px"} src={post.img} alt="Uploaded" className="Feed-Post-img" />
                        ) : post.img ? (
                            <>
                                <div className="video-container">
                                    <video
                                        ref={videoRef}
                                        className="post-video"
                                        preload="auto"
                                        onClick={handleVideoBtnClick}
                                    >
                                        <source src={post.img} type="video/mp4" />
                                    </video>
                                    {!isPlaying && (
                                        <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                            <div className="play-button">
                                                <FaPlay className='play-button' />
                                            </div>
                                        </a>
                                    )}
                                </div>


                            </>

                        ) : null}



                    </div>

                    {/* Feed Comment */}

                    <div className="feed-bottom-container">

                        {/* Like */}
                        <div className="feed-bottom-mainu">
                            {liked ? (
                                <>
                                    <div className="feed-bottom-like-div" onClick={handleCloseRightComment}>
                                        <BsFillHeartFill onClick={() => Heart(post.id)} className='feed-bottom-like-heart ' color='#FF0040' />

                                        <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon dark:text-darkPostText" onClick={() => showLike(post.id)}>
                                            {like.length > 99 ? '99+' : like.length}

                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="feed-bottom-like-div" onDoubleClick={handleCloseRightComment}>
                                        <AiOutlineHeart onClick={() => { Heart(post.id); handleCloseRightComment(); }} style={{ fontSize: "28px" }} className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                                        {like.length > 0 ?
                                            <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon dark:text-darkPostText" onClick={() => showLike(post.id)}>
                                                {like.length > 99 ? '99+' : like.length}
                                            </div>
                                            :
                                            ""
                                        }
                                    </div>
                                </>
                            )}

                            {showLikedName &&
                                <div className='See-Like-div'>

                                    <div className='userliked' id={`isliked${post.id}`} >
                                        {isliked.map((item) => {
                                            return (
                                                <div key={item.id}>
                                                    <div className='mx-1' style={{ fontSize: "11px" }}>{item.name}</div>
                                                </div>
                                            )

                                        })}
                                    </div>
                                </div>
                            }

                        </div>

                        {/* Comment  */}
                        <div className="feed-bottom-mainu">
                            <div className="feed-bottom-mainu">

                                <div className="feed-bottom-like-div">
                                    {rightComment ?
                                        <img src={sms} style={{ width: "26px" }} onClick={() => handleRightComment(post.id)} className='feed-bottom-like-heart' alt="" />
                                        :
                                        <BsFillChatDotsFill onClick={() => handleRightComment(post.id)} className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                                    }
                                    {commentCount ?
                                        <Link to={`/notification/${post.id}`}>
                                            <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon dark:text-darkPostText" onClick={handleCloseRightComment}>
                                                <div>{commentCount > 99 ? '99+' : commentCount}</div>
                                            </div>
                                        </Link>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="feed-bottom-mainu">
                            <FaShare className='feed-bottom-icon text-lightPostIconBottom dark:text-darkPostIcon' />
                        </div>

                    </div>

                    {rightComment &&

                        <div className='feed-right-commnet-div'>
                            <input
                                type="text"
                                placeholder='Comment'
                                value={getComment}
                                onChange={(e) => setComment(e.target.value)}
                                className='feed-right-comment-input bg-lightPostIconBottom text-lightProfileName dark:bg-darkInput dark:text-darkProfileName'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent the default "Enter" behavior (e.g., form submission)
                                        if (getComment.trim() !== '') {
                                            HandleComment(e, post.id);
                                        }
                                    }
                                }}
                            />
                            <div>
                                {getComment != "" ?

                                    <BiSolidSend className='feed-right-comment-icon' color='#0080FF' onClick={(e) => HandleComment(e, post.id)} />
                                    :
                                    <BiSend className='feed-right-comment-icon' color='#84878a' onClick={(e) => HandleComment(e, post.id)} />

                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default UserPostPage
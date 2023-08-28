import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import "./Feed.scss"
import { BsFillChatDotsFill, BsFillHeartFill, BsThreeDotsVertical } from "react-icons/bs"
import { FaPlay, FaShare } from "react-icons/fa"
import ReactTimeago from 'react-timeago';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishStrings from 'react-timeago/lib/language-strings/en';
import { IoMdClose, IoMdSend, IoMdShareAlt } from "react-icons/io";
import TimeAgo from 'react-timeago';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Picker from '@emoji-mart/react';
import "./FeedOverlay.scss";
import photo from "./../Image/img/photo.png";
import { LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiSend, BiSolidSend } from 'react-icons/bi';

const Feed = ({ post }) => {
    const { currentUser } = useContext(AuthContext);

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVideoInView, setIsVideoInView] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            const video = videoRef.current;
            const rect = video.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (isInViewport) {
                if (video.paused) {
                    video.play();
                    setIsPlaying(true);
                }
            } else {
                if (!video.paused) {
                    video.pause();
                    setIsPlaying(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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


    // Like Post 
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

    const Heart = async (id) => {
        handleClick();
        const element = document.getElementById(`myheart-${id}`)

        if (liked) {
            await deleteDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid));

            await deleteDoc(doc(db, "AllPosts", post.id, "Notification", currentUser.uid));


        } else {
            await setDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid), {
                userId: currentUser.uid,
                name: currentUser.displayName,
                time: serverTimestamp(),
                id: post.id,
                img: post.img,
                photoUrl: currentUser.photoURL
            });
            await setDoc(doc(db, "AllPosts", post.id, "Notification", currentUser.uid), {
                userId: currentUser.uid,
                name: currentUser.displayName,
                time: serverTimestamp(),
                id: post.id,
                img: post.img,
                photoUrl: currentUser.photoURL,
                like: "like",
                isUnRead: true
            });

            // element.style.color = '#FF0040';
        }

    }

    const handleClick = () => {
        setAnimate(!animate);
    };


    const [showLikedName, setShowLikedName] = useState(false);
    function showLike() {
        setShowLikedName(!showLikedName);
    }
    function CloseShowLike() {
        setShowLikedName(false);
    }



    function TimeAgoComponent({ timestamp }) {
        return <ReactTimeago date={timestamp} />;
    }

    // Comment 

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

    function comment(id) {
        const element = document.getElementById(`comment-${id}`);
        // const like = document.getElementById(`showliked-${id}`)

        if (element.style.display === 'none') {
            // like.style.display = 'none';
            element.style.display = 'flex'
        } else {
            element.style.display = 'none'
        }
    }

    const [rightComment, setRightComment] = useState(false);
    const handleRightComment = () => {
        setRightComment(!rightComment)
    };
    const handleCloseRightComment = () => {
        setRightComment(false);
    };

    const deleteComment = (id) => {
        const CommentRf = doc(db, 'AllPosts', post.id, "comments", id)
        deleteDoc(CommentRf);
    };

    const handleKey = (e, id) => {
        if (e.key === "Enter") {
            e.preventDefault();
            HandleComment(id);
            done(id);
        }
    };

    const HandleComment = async (e, id) => {
        e.preventDefault();
        if (!getComment) {
            return;
        }
        setComment('');
        setShowEmoji(false);
        setRightComment(false);

        // Adding a comment to the 'comments' collection under a specific post
        await addDoc(collection(db, 'AllPosts', id, 'comments'), {
            comment: getComment,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            commentTime: serverTimestamp(),
        });

        // Adding a notification to the 'Notification' collection under the same post
        await addDoc(collection(db, 'AllPosts', id, 'Notification'), {
            comment: getComment,
            com: "comment",
            name: currentUser.displayName,
            photoUrl: currentUser.photoURL,
            uid: currentUser.uid,
            time: serverTimestamp(),
        });

        // Clearing the comment input field after adding the comment and notification
        setComment('');
    };


    const [showAll, setShowAll] = useState(false);

    const formatter = buildFormatter(englishStrings);
    const userComment = newComment.slice(0, showAll ? newComment.length : 3).map((item) => {

        return (
            <div key={item.id}>
                <span className="UserComment-wrapper">
                    <div className="UserComment-div">
                        <div className="UserComment-Profile-div">
                            <img src={item.photoURL} className='UserComment-Profile-img' alt="" />
                            <div className="UserComment-Profile-name">
                                {item.displayName}
                            </div>
                        </div>
                        <div className="UserCommet-Text-div">
                            {item.comment}
                        </div>
                    </div>
                </span>
            </div>
        )
    });

    const [editInput, setEditInput] = useState('');
    const [EditImg, setEditImg] = useState(null);
    const [updating, setUpdating] = useState(false);

    const [loading, setLoading] = useState(false);

    const done = async (id) => {
        setUpdating(true);
        const postRef = doc(db, 'AllPosts', id);
        if (!editInput) {
            return
        }
        if (EditImg) {
            // If a new image is provided, upload it to storage and update the document
            const storageRef = ref(storage, `Post/${EditImg.name}`);
            await uploadBytes(storageRef, EditImg);

            const imageUrl = await getDownloadURL(storageRef);

            await updateDoc(postRef, {
                postText: editInput,
                img: imageUrl
            });
        } else {
            // If no new image is provided, only update the name field
            await updateDoc(postRef, {
                postText: editInput
            });
        }
        setEditInput("");
        setUpdating(false);
        document.getElementById(`FeedOverlay-${id}`).style.display = 'none';
        const x = document.getElementById(`myDropdown-${id}`);
        x.style.display = 'none';

    }

    // Emoji 

    const [showEmoji, setShowEmoji] = useState(false);
    const Emoji = () => {
        setShowEmoji(!showEmoji);
    };

    const addEmoji = (e) => {
        let sym = e.unified.split("-")
        let codesArray = []
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setComment(getComment + emoji);
    };

    // Option

    function OptionBtn(id) {
        const x = document.getElementById(`myDropdown-${id}`);
        const profile = document.getElementById(`profileView-${id}`);
        const del = document.getElementById(`del-${id}`);

        // Check if the clicked dropdown is currently closed
        if (x.style.display === 'none') {
            closeAllDropdowns(); // Close all other open dropdowns
            x.style.display = 'block';
            profile.style.display = 'none';
        } else {
            x.style.display = 'none';
        }

        // Hide edit and delete options for other users' posts
        if (currentUser.displayName !== post.displayName) {
            document.getElementById(`edit-${id}`).style.display = 'none';
            profile.style.display = 'block';
            del.style.display = 'none';
        }
    }

    // Function to close all open dropdowns
    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.feed-option-mainu-div');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }


    function postEdit(id) {
        // const x = document.getElementById(`edit-${id}`);
        document.getElementById(`overlay-${id}`).style.display = 'block'
        const dropdown = document.getElementById(`myDropdown-${id}`);

        if (dropdown) {
            dropdown.classList.remove('show');
        }

    };

    const deletePost = async id => {
        const colRef = doc(db, 'AllPosts', id)
        deleteDoc(colRef)
    }

    function feedOff(id) {
        document.getElementById(`FeedOverlay-${id}`).style.display = 'none';
        setEditImg(null);
        const x = document.getElementById(`myDropdown-${id}`);
        x.style.display = 'none';
        setEditInput("");
    }

    function feedOn(id) {
        document.getElementById(`FeedOverlay-${id}`).style.display = "block";
    }

    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(collection(db, `allFriends/${currentUser.uid}/Friends`));
                const friendsSnapshot = await getDocs(friendsQuery);
                const friendsData = friendsSnapshot.docs.map(doc => doc.data());
                setFriendsList(friendsData);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);


    return (
        <>

            <div id={`FeedOverlay-${post.id}`}
                className='feed-overlay-container' style={{ display: "none" }} >
                <div className="feed-overlay-inner">

                    <div className="feed-Edit-card">
                        <div className="feed-edit-inner-div">
                            <div className='feed-close-div' >
                                <IoMdClose style={{ fontSize: "24px" }} onClick={() => feedOff(post.id)} />
                            </div>
                            <div className="feed-main-card">
                                {updating ? (<LinearProgress className='l-progress' />) : null}

                                <div className='feed-main-innner'>
                                    <div>
                                        <input type="text"
                                            placeholder="What's on your mind"
                                            className='feed-edit-input'
                                            onChange={(e) => setEditInput(e.target.value)}
                                            value={editInput}
                                            id={`editInput-${post.id}`}
                                        />
                                    </div>


                                    <label htmlFor="EditImg">
                                        <div className='feed-edit-photo-div'>
                                            <img src={photo} s alt="" /><span className='feed-ed-photo-text'>Photo</span>
                                        </div>
                                    </label>

                                    {EditImg && EditImg.type.startsWith('image/') && (
                                        <img className="postImg" src={URL.createObjectURL(EditImg)} alt="" />
                                    )}

                                    <input type="file" id='EditImg'
                                        onChange={(e) => setEditImg(e.target.files[0])}
                                        style={{ display: "none" }} accept="image/*, video/*" />


                                    <div className="btn-primary-custom mt-3"
                                        onClick={(e) => done(post.id)}
                                    >Update</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="feed-container">

                <div className="feed-div">

                    <div className="feed-profile-div">
                        <img src={post.photoURL} className='feed-img' alt="" />

                        <div className="feed-profile-name">
                            {post.displayName}
                        </div>

                        <div className="feed-time">
                            <TimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} />
                        </div>

                        <div className='feed-option-div'>
                            <div className="feed-option-btn">
                                <BsThreeDotsVertical className='feed-icon' onClick={() => OptionBtn(post.id)} />
                            </div>
                            <div className="feed-option-mainu-div" id={`myDropdown-${post.id}`} style={{ display: "none" }}>

                                <div className='feed-option-edit ' id={`edit-${post.id}`}
                                    onClick={() => feedOn(post.id)}>Edit</div>

                                <div className='feed-option-delete '
                                    id={`del-${post.id}`}
                                    onClick={() => deletePost(post.id)} >Delete</div>



                                <Link to={`/users/${post.uid}`}>
                                    <div className='feed-option-view ' id={`profileView-${post.id}`}>View Profiel</div>
                                </Link>

                            </div>
                        </div>
                    </div>

                    {/* Feed Text */}
                    <div className="feed-post-text">
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
                                        <BsFillHeartFill onClick={() => Heart(post.id)} className='feed-bottom-like-heart' color='#FF0040' />

                                        <div className="feed-bottom-like-count" onClick={() => showLike(post.id)}>
                                            {like.length > 9 ? '9+' : like.length}

                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="feed-bottom-like-div" onDoubleClick={handleCloseRightComment}>
                                        <AiOutlineHeart onClick={() => { Heart(post.id); handleCloseRightComment(); }} style={{ fontSize: "28px" }} className='feed-bottom-like-heart' />
                                        {like.length > 0 ?
                                            <div className="feed-bottom-like-count" onClick={() => showLike(post.id)}>
                                                {like.length > 9 ? '9+' : like.length}
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

                            <div className="feed-bottom-like-div">
                                <BsFillChatDotsFill onClick={() => handleRightComment(post.id)} className='feed-bottom-like-heart' />
                                {commentCount ?
                                    <Link to={`/notification/${post.id}`}>
                                        <div className="feed-bottom-like-count" onClick={handleCloseRightComment}>
                                            <div>{commentCount > 99 ? '99+' : commentCount}</div>
                                        </div>
                                    </Link>
                                    :
                                    null
                                }
                            </div>
                        </div>

                        {/* Share */}
                        <div className="feed-bottom-mainu">
                            <FaShare className='feed-bottom-icon' />
                        </div>

                    </div>

                    {rightComment &&

                        <div className='feed-right-commnet-div'>
                            <input
                                type="text"
                                placeholder='write a Comment'
                                value={getComment}
                                onChange={(e) => setComment(e.target.value)}
                                className='feed-right-comment-input'
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
            </div >


        </>
    )
}

export default Feed

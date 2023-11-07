import "./UserPost.scss";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsFillChatDotsFill, BsFillHeartFill, BsThreeDotsVertical } from "react-icons/bs"
import { FaPlay, FaShare } from "react-icons/fa"
import ReactTimeago from 'react-timeago';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from './../../Firebase';
import { AuthContext } from './../../AuthContaxt';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishStrings from 'react-timeago/lib/language-strings/en';
import { IoMdClose, IoMdSend, IoMdShareAlt } from "react-icons/io";
import TimeAgo from 'react-timeago';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import Picker from '@emoji-mart/react';
import { LinearProgress } from '@mui/material';
import photo from "./../../Image/img/photo.png";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { BiSend, BiSolidSend } from "react-icons/bi";
import sms from "./../../Image/img/sms.png";

const UserPost = ({ post }) => {

    const { currentUser } = useContext(AuthContext);
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

    const OverlayHandleVideoBtnClick = () => {
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
            // element.style.color = 'white';
        } else {
            await setDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid), {
                userId: currentUser.uid,
                name: currentUser.displayName
            });
            // element.style.color = '#FF0040';
        }

    }

    const handleClick = () => {
        setAnimate(!animate);
    };



    function showLike(id) {
        const element = document.getElementById(`showliked-${id}`)
        const comment = document.getElementById(`comment-${id}`);

        if (element.style.display === 'none') {
            element.style.display = 'flex'
            comment.style.display = 'none';
        } else {
            element.style.display = 'none'
        }
    }


    function PostTimeAgoComponent({ timestamp }) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

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
            return `${days}d ago`;
        }
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
            HandleComment(id);
            done(id);
        }
    };

    const HandleComment = async (e, id) => {
        e.preventDefault();
        if (!getComment) {
            return
        }
        setShowEmoji(false)
        await addDoc(collection(db, 'AllPosts', id, 'comments'), {
            comment: getComment,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            commentTime: serverTimestamp(),
        });

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

    const compressImage = async (imageFile, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(imageFile);
        });
    };

    const [overlayLoading, setOverlayLoading] = useState(null)
    const done = async (id) => {
        setUpdating(true);
        const postRef = doc(db, 'AllPosts', id);


        if (overlayFile) {
            const storageRef = ref(storage, `Post/${overlayFile.name}`);

            // Check if overlayFile is an image (e.g., JPEG, PNG)
            if (overlayFile.type.startsWith('image/')) {
                const compressedImgBlob = await compressImage(overlayFile, 800);
                const uploadTask = uploadBytesResumable(storageRef, compressedImgBlob);

                // Set up progress tracking for image upload
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log(`Image Upload Progress: ${progress}%`);
                        setOverlayLoading(progress);
                        if (progress > 0) {
                            document.getElementById("overlayLoading").style.display = "block";
                        }
                        if (progress === 100) {
                            document.getElementById("overlayLoading").style.display = "none";
                        }
                    },
                    (error) => {
                        // Handle errors here
                        console.error('Error uploading image:', error);
                    },
                    () => {
                        // Image upload completed successfully
                        getDownloadURL(storageRef)
                            .then((imageUrl) => {
                                // Update the document with the download URL and name
                                return updateDoc(postRef, {
                                    name: overlayFile.name,
                                    postText: editedText,
                                    img: imageUrl
                                });
                            })
                            .then(() => {
                                // Reset input and update UI
                                setEditInput("");
                                setUpdating(false);
                                document.getElementById(`FeedOverlay-${id}`).style.display = 'none';
                                const x = document.getElementById(`myDropdown-${id}`);
                                x.style.display = 'none';
                            })
                            .catch((error) => {
                                console.error('Error updating document:', error);
                            });
                    }
                );
            } else if (overlayFile.type.startsWith('video/')) {
                // If overlayFile is a video, upload it without compression
                const uploadTask = uploadBytesResumable(storageRef, overlayFile);

                // Set up progress tracking for video upload
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log(`Video Upload Progress: ${progress}%`);
                        setOverlayLoading(progress);
                        if (progress > 0) {
                            document.getElementById("overlayLoading").style.display = "block";
                        }
                        if (progress === 100) {
                            document.getElementById("overlayLoading").style.display = "none";
                        }
                    },
                    (error) => {
                        // Handle errors here
                        console.error('Error uploading video:', error);
                    },
                    () => {
                        // Video upload completed successfully
                        getDownloadURL(storageRef)
                            .then((videoUrl) => {
                                // Update the document with the video URL and name
                                return updateDoc(postRef, {
                                    name: overlayFile.name,
                                    postText: editedText,
                                    img: videoUrl
                                });
                            })
                            .then(() => {
                                // Reset input and update UI
                                setEditInput("");
                                setUpdating(false);
                                document.getElementById(`FeedOverlay-${id}`).style.display = 'none';
                                const x = document.getElementById(`myDropdown-${id}`);
                                x.style.display = 'none';
                            })
                            .catch((error) => {
                                console.error('Error updating document:', error);
                            });
                    }
                );
            }
        } else {
            // If no new file is provided, only update the name field
            await updateDoc(postRef, {
                postText: editedText
            });
            setEditInput("");
            setUpdating(false);
            setOverlayFile(null);
            document.getElementById(`FeedOverlay-${id}`).style.display = 'none';
            const x = document.getElementById(`myDropdown-${id}`);
            x.style.display = 'none';
        }
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

        if (x.style.display == 'none') {
            x.style.display = 'block';
            profile.style.display = 'none';
        } else {
            x.style.display = 'none';
        }
        if (currentUser.displayName !== post.displayName) {
            document.getElementById(`edit-${id}`).style.display = 'none';
            profile.style.display = 'block';
            del.style.display = 'none';
        }
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

    function off(id) {
        document.getElementById(`overlay-${id}`).style.display = 'none';
        setEditImg(null);
    }

    const [showLikedName, setShowLikedName] = useState(false);
    function showLike() {
        setShowLikedName(!showLikedName);
    }

    const [editedText, setEditedText] = useState(post.postText);
    const [overlayFile, setOverlayFile] = useState(null);

    return (
        <>

            <div id={`FeedOverlay-${post.id}`}
                className='feed-overlay-container ' style={{ display: "none" }} >

                <div className="feed-overlay-div bg-lightDiv dark:bg-darkDiv">
                    <div className="feed-overlay-close-btn-div">
                        <div className="feed-overlay-text-div">
                            <div className='overlay-edit-postText'>
                                <input
                                    type="text"
                                    placeholder="Edit your mind"
                                    className='overlay-edit-input bg-light_0  dark:bg-darkInput '
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                />
                            </div>
                        </div>
                        <IoMdClose className='feed-overlay-close-btn' onClick={() => feedOff(post.id)} />
                    </div>


                    <div className="select-overlay-file-input">
                        <input
                            type="file"
                            id="overlay-file-input" // Add the id attribute
                            className="select-overlay-file-input"
                            onChange={(e) => {
                                setOverlayFile(e.target.files[0]);
                            }}
                        />
                        <div className='overlay-post-btn' onClick={(e) => done(post.id)}>Post</div>
                    </div>


                    <div className='overlayMedia-div'>
                        {overlayLoading && overlayLoading < 98 ?
                            <div className="overlayLoading" id='overlayLoading'>
                                <div className="overlayLoading-Count">
                                    {Math.floor(overlayLoading)}%
                                </div>
                            </div>
                            :
                            null
                        }

                        {overlayFile ?
                            (<>

                                {overlayFile &&
                                    overlayFile.type.startsWith('image/') && (
                                        <img className="Feed-Post-img" src={URL.createObjectURL(overlayFile)} alt="" />
                                    )}

                                {overlayFile &&
                                    overlayFile.type.startsWith('video/') && (
                                        <video ref={videoRef} onClick={OverlayHandleVideoBtnClick} className="post-video ">
                                            <source src={URL.createObjectURL(overlayFile)} type={overlayFile.type} />
                                        </video>
                                    )}

                            </>)
                            :
                            (<>

                                {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                                    <img width={"300px"} src={post.img} alt="Uploaded" className="Feed-Post-img" />
                                ) : post.img ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            className="post-video"
                                            preload="auto"
                                        >
                                            <source src={post.img} type="video/mp4" />
                                        </video>
                                    </>

                                ) : null}

                            </>)
                        }
                    </div>

                </div>

            </div>



            <div className="feed-container">

                <div className="feed-div bg-lightDiv dark:bg-darkDiv">

                    <div className="feed-profile-div">
                        <img src={post.photoURL} className='feed-img' alt="" />

                        <div className="feed-profile-name text-lightProfileName dark:text-darkProfileName">
                            {post.displayName.length > 20 ? post.displayName.slice(0, 20) : post.displayName}
                        </div>

                        <div className="feed-time text-lightPostTime  dark:text-darkPostTime">
                            <PostTimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} />
                        </div>

                        <div className='feed-option-div'>
                            <div className="feed-option-btn bg-light_0 dark:bg-darkInput">
                                <BsThreeDotsVertical className='feed-icon text-lightOptionText dark:text-darkPostTime' onClick={() => OptionBtn(post.id)} />
                            </div>
                            <div className="feed-option-mainu-div dark:text-darkPostText text-lightPostText bg-light_0 dark:bg-darkInput" id={`myDropdown-${post.id}`} style={{ display: "none" }}>

                                <div className='feed-option-edit ' id={`edit-${post.id}`}
                                    onClick={() => feedOn(post.id)}>Edit</div>

                                <div className='feed-option-delete '
                                    id={`del-${post.id}`}
                                    onClick={() => deletePost(post.id)} >Delete</div>



                                <Link to={`/users/${post.uid}/${post.id}/profile`}>
                                    <div className='feed-option-view ' id={`profileView-${post.id}`}>View Profiel</div>
                                </Link>

                            </div>
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
                                        <BsFillHeartFill onClick={() => Heart(post.id)} className='feed-bottom-like-heart' color='#FF0040' />

                                        <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText
                                        dark:bg-darkPostIcon dark:text-darkPostText
                                        " onClick={() => showLike(post.id)}>
                                            {like.length > 99 ? '99+' : like.length}

                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="feed-bottom-like-div" onDoubleClick={handleCloseRightComment}>
                                        <AiOutlineHeart onClick={() => { Heart(post.id); handleCloseRightComment(); }} style={{ fontSize: "28px" }} className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                                        {like.length > 0 ?
                                            <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText 
                                            dark:bg-darkPostIcon dark:text-darkPostText
                                            " onClick={() => showLike(post.id)}>
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

                            <div className="feed-bottom-like-div dark:text-darkPostIcon">
                                {rightComment ?
                                    <img src={sms} style={{ width: "26px" }} onClick={() => handleRightComment(post.id)} className='feed-bottom-like-heart' alt="" />
                                    :
                                    <BsFillChatDotsFill onClick={() => handleRightComment(post.id)} className='feed-bottom-like-heart text-lightPostIconBottom   dark:text-darkPostIcon' />
                                }
                                {commentCount ?
                                    <Link to={`/notification/${post.id}`}>
                                        <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon  dark:text-darkPostText" onClick={handleCloseRightComment}>
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
                            <FaShare className='feed-bottom-icon text-lightPostIconBottom dark:text-darkPostIcon' />
                        </div>

                    </div>

                    {rightComment &&

                        <div className='feed-right-commnet-div'>
                            <input
                                type="text"
                                placeholder='write a Comment'
                                value={getComment}
                                onChange={(e) => setComment(e.target.value)}
                                className='feed-right-comment-input  bg-lightPostIconBottom text-lightProfileName dark:bg-darkInput dark:text-darkProfileName'
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


        </>
    )
}

export default UserPost

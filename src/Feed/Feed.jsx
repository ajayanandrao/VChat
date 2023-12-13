import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Feed.scss"
import { BsFillChatDotsFill, BsFillHeartFill, BsThreeDotsVertical } from "react-icons/bs"
import { FaPlay, FaShare } from "react-icons/fa"
import { Timestamp, addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishStrings from 'react-timeago/lib/language-strings/en';
import { IoMdClose, } from "react-icons/io";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import "./FeedOverlay.scss";
import { Link } from 'react-router-dom';
import { AiOutlineHeart } from 'react-icons/ai';
import { BiSend, BiSolidSend } from 'react-icons/bi';
import sms from "./../Image/img/sms.png";
import { v4 } from 'uuid';
const Feed = ({ post }) => {
    const { currentUser } = useContext(AuthContext);

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

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

    const Heart = async (id, uid) => {
        handleClick();
        const element = document.getElementById(`myheart-${id}`)

        if (liked) {
            await deleteDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid));

            await deleteDoc(doc(db, "AllPosts", post.id, "Notification", currentUser.uid));

            const userMessagesQuery = query(
                collection(db, "Notification"),
                where('id', '==', id),
                where('userId', '==', currentUser.uid)
            );

            const userMessagesSnapshot = await getDocs(userMessagesQuery);

            if (!userMessagesSnapshot.empty) {
                const docToDelete = userMessagesSnapshot.docs[0];
                await deleteDoc(doc(db, "Notification", docToDelete.id));
            }


        } else {
            await setDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid), {
                userId: currentUser.uid,
                name: currentUser.displayName,
                time: serverTimestamp(),
                id: post.id,
                img: post.img,
                photoUrl: currentUser.photoURL
            });


            await setDoc(doc(db, "Notification", post.id), {
                userId: currentUser.uid,
                name: currentUser.displayName,
                timestamp: serverTimestamp(),
                id: post.id,
                photoUrl: currentUser.photoURL,
                like: "like",
                isUnRead: true,
                postSenderUid: uid,
                img: post.img,
                imgName: post.name
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



    // function TimeAgoComponent({ timestamp }) {
    //     return <ReactTimeago date={timestamp} />;
    // }

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

    const HandleComment = async (e, id, uid) => {
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


        await setDoc(doc(db, "Notification", post.id), {
            userId: currentUser.uid,
            name: currentUser.displayName,
            timestamp: serverTimestamp(),
            id: post.id,
            photoUrl: currentUser.photoURL,
            comment: getComment,
            isUnRead: true,
            postSenderUid: uid,
            img: post.img,
            imgName: post.name
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
        handleShareOverlayOff();
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

        const share = document.querySelectorAll('.feed-share-overlay-div');
        share.forEach(dropdown => {
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

    const deletePost = async (id) => {
        const colRef = doc(db, 'AllPosts', id)
        deleteDoc(colRef)
        const notiRef = doc(db, 'Notification', id);
        deleteDoc(notiRef)
        // console.log("post delted successfully")
    }

    function feedOff(id) {
        setOverlayFile(null);
        document.getElementById(`FeedOverlay-${id}`).style.display = 'none';
        setEditImg(null);
        const x = document.getElementById(`myDropdown-${id}`);
        x.style.display = 'none';
        setEditInput("");
        setEditedText(post.postText)

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

    const [editedText, setEditedText] = useState(post.postText);
    const [overlayFile, setOverlayFile] = useState(null);


    const [handleShowOverlay, setHandleShowOverlay] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlayId, setShowOverlayId] = useState("");

    const handleShareOverlay = (id) => {
        setHandleShowOverlay(!handleShowOverlay)
        const dropdowns = document.querySelectorAll('.feed-option-mainu-div');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        const share = document.getElementById(`feed-share-overlay-div${id}`);
        share.forEach(dropdown => {
            dropdown.style.display = 'flex';
        });
    };
    const handleShareOverlayOff = () => {
        setHandleShowOverlay(false);
    };
    const ShareOverlay = (id) => {
        setShowOverlayId(id);
        setShowOverlay(!showOverlay)
        // console.log(showOverlayId.postText)
    };

    const ShareOverlayOff = () => {
        setShowOverlay(null);
        setShowOverlayId("");
    };

    const Share = async (post) => {
        const allPostsColRef = collection(db, 'AllPosts');
        const userPostsListRef = doc(db, 'userPostsList', currentUser.uid);

        await addDoc(allPostsColRef, {
            name: post.img ? post.name : '',
            img: post.img ? post.img : '', // Only use the downloadURL if a img was uploaded
            uid: currentUser.uid,
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
            postText: post.postText,
            bytime: serverTimestamp() // Use the server timestamp here
        });


        await updateDoc(userPostsListRef, {
            messages: arrayUnion({
                id: v4(),
                uid: currentUser.uid,
                photoURL: currentUser.photoURL,
                displayName: currentUser.displayName,
                postText: post.postText,
                img: post.img,
                bytime: Timestamp.now()
            })
        });

        ShareOverlayOff();
    };


    return (
        <>

            {showOverlay ?
                <div className='feed-overlay-container '>

                    <div className="feed-overlay-div bg-lightDiv dark:bg-darkDiv">
                        <div className="feed-overlay-close-btn-div">
                            <div className="feed-overlay-text-div">
                                <div className='overlay-edit-postText text-lightProfileName dark:text-darkProfileName'>
                                    {showOverlayId.postText}
                                </div>
                            </div>
                            <IoMdClose className='feed-overlay-close-btn text-[black] dark:text-lightDiv' onClick={ShareOverlayOff} />
                        </div>


                        <div className="select-overlay-file-input" style={{ justifyContent: "end", paddingRight: "50px" }} >
                            <div className='overlay-post-btn' style={{ cursor: "pointer" }} onClick={(e) => Share(showOverlayId)}>Share</div>
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

                </div >
                :
                null
            }

            <div id={`FeedOverlay-${post.id}`}
                className='feed-overlay-container ' style={{ display: "none" }} >

                <div className="feed-overlay-div bg-lightDiv dark:bg-darkDiv">
                    <div className="feed-overlay-close-btn-div">
                        <div className="feed-overlay-text-div">
                            <div className='overlay-edit-postText'>
                                <input
                                    type="text"
                                    placeholder="Edit your mind"
                                    className='overlay-edit-input bg-light_0 text-lightProfileName dark:bg-darkInput dark:text-darkProfileName '
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                />
                            </div>
                        </div>
                        <IoMdClose className='feed-overlay-close-btn text-[black] dark:text-lightDiv' onClick={() => feedOff(post.id)} />
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
                        <div className='overlay-post-btn' style={{ cursor: "pointer" }} onClick={(e) => done(post.id)}>Post</div>
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
                        <Link to={`${currentUser.uid === post.uid ? `/profile/` : `/${post.uid}`}`} className='link d-flex align-items-center'>
                            <img src={post.photoURL} className='feed-img' alt="" />

                            <div className="feed-profile-name text-lightProfileName dark:text-darkProfileName">
                                {post.displayName.length > 20 ? post.displayName.slice(0, 20) : post.displayName}

                            </div>
                        </Link>
                        <div className="feed-time text-lightPostTime dark:text-darkPostTime">
                            {/* <TimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} /> */}
                            <PostTimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} />
                        </div>

                        <div className='feed-option-div'>
                            <div className="feed-option-btn bg-light_0 dark:bg-darkInput">
                                <BsThreeDotsVertical className='feed-icon text-lightOptionText dark:text-darkPostTime' onClick={() => { OptionBtn(post.id); handleShareOverlayOff(); }} />
                            </div>
                            <div className="feed-option-mainu-div dark:text-darkPostText text-lightPostText bg-light_0 dark:bg-darkInput" id={`myDropdown-${post.id}`} style={{ display: "none" }}>

                                <div className='feed-option-edit ' id={`edit-${post.id}`}
                                    onClick={() => feedOn(post.id)}>Edit</div>

                                <div className='feed-option-delete '
                                    id={`del-${post.id}`}
                                    onClick={() => deletePost(post.id)} >Delete</div>



                                <Link to={`/users/${post.uid}`} className='link'>
                                    <div className='feed-option-view ' id={`profileView-${post.id}`}>View Profiel</div>
                                </Link>

                            </div>
                        </div>
                    </div>

                    {/* Feed Text */}
                    <div className="feed-post-text text-lightPostText dark:text-darkPostText">
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
                                    <div className="feed-bottom-like-div" onClick={() => { handleCloseRightComment(); handleShareOverlayOff(); }}>
                                        <BsFillHeartFill onClick={() => Heart(post.id, post.uid)} className='feed-bottom-like-heart' color='#FF0040' />

                                        <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon  dark:text-darkPostText " onClick={() => { showLike(post.id) }}>
                                            {like.length > 9 ? '9+' : like.length}

                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="feed-bottom-like-div" onDoubleClick={() => { handleCloseRightComment(); handleShareOverlayOff(); }}>
                                        <AiOutlineHeart onClick={() => { Heart(post.id, post.uid); handleCloseRightComment(); handleShareOverlayOff(); }}
                                            style={{ fontSize: "28px" }} className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                                        {like.length > 0 ?
                                            <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon dark:text-darkPostText"
                                                onClick={() => showLike(post.id)}>
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
                                {rightComment ?
                                    <img src={sms} style={{ width: "26px" }} onClick={() => { handleRightComment(post.id); handleShareOverlayOff(); }} className='feed-bottom-like-heart' alt="" />
                                    :
                                    <BsFillChatDotsFill onClick={() => { handleRightComment(post.id); handleShareOverlayOff(); }} className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                                }
                                {commentCount ?
                                    <Link to={`/notification/${post.id}`}>
                                        <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon  dark:text-darkPostText" onClick={() => { handleCloseRightComment(); handleShareOverlayOff(); }}>
                                            <div>{commentCount > 99 ? '99+' : commentCount}</div>
                                        </div>
                                    </Link>
                                    :
                                    null
                                }
                            </div>
                        </div>

                        {/* Share */}

                        {handleShowOverlay ?
                            <div id={`feed-share-overlay-div${post.id}`} className="feed-share-overlay-div text-lightProfileName dark:text-darkProfileName bg-light_0 dark:bg-darkInput">
                                <span style={{ cursor: "pointer" }} onClick={() => ShareOverlay(post)}>Share to Feed</span>
                            </div>
                            :
                            null
                        }

                        <div className="feed-bottom-mainu">
                            <FaShare className='feed-bottom-icon text-lightPostIconBottom dark:text-darkPostIcon'
                                onClick={() => handleShareOverlay(post.id)} />
                        </div>

                    </div>

                    {rightComment &&

                        <div className='feed-right-commnet-div'>
                            <input
                                type="text"
                                placeholder='write a Comment'
                                value={getComment}
                                onChange={(e) => setComment(e.target.value)}
                                className='feed-right-comment-input bg-light_0 text-lightProfileName dark:bg-darkInput dark:text-darkProfileName'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent the default "Enter" behavior (e.g., form submission)
                                        if (getComment.trim() !== '') {
                                            HandleComment(e, post.id, post.uid);
                                        }
                                    }
                                }}
                            />
                            <div>
                                {getComment != "" ?

                                    <BiSolidSend className='feed-right-comment-icon' color='#0080FF' onClick={(e) => HandleComment(e, post.id, post.uid)} />
                                    :
                                    <BiSend className='feed-right-comment-icon' color='#84878a' onClick={(e) => HandleComment(e, post.id, post.uid)} />

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

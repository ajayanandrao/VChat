import React, { useEffect, useState, useRef, useContext } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '../Firebase';

import './Reals.scss';
import { FaPlay, FaShare } from 'react-icons/fa';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineHeart } from 'react-icons/ai';
import { BsBalloonHeart, BsBalloonHeartFill, BsFillHeartFill, BsHeart, BsHeartFill, BsHearts } from 'react-icons/bs';
import { AuthContext } from '../AuthContaxt';
import { Link, useNavigate } from 'react-router-dom';
import Heart from "react-animated-heart";
import { CgClose } from "react-icons/cg";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

const VideoItem = ({ post }) => {
    const { currentUser } = useContext(AuthContext);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoBtnClick = (id) => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        const handleIntersection = (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        };

        const observer = new IntersectionObserver(handleIntersection, {
            root: null, // The viewport
            rootMargin: '0px', // No margin
            threshold: 0.8, // At least 50% of the video must be in view
        });

        observer.observe(video);

        return () => {
            observer.unobserve(video);
        };
    }, []);

    const scrollToPreview = (id) => {
        const element = document.getElementById(`section2-${id}`);
        if (element && element.previousElementSibling) {
            element.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }

    };

    const scrollToNext = (id) => {

        const element = document.getElementById(`section2-${id}`);
        if (element && element.nextElementSibling) {
            element.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }

    };

    const [liked, setLiked] = useState(false);
    const [like, setLike] = useState([]);
    const [isliked, setIsliked] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'UserPostPhoto', post.id, 'likes')),
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
        const unsub = onSnapshot(collection(db, "UserPostPhoto", post.id, "likes"),
            (snapshot) => setLike(snapshot.docs)
        );
        return () => {
            unsub();
        };
    }, [post.id]);

    useEffect(() => {
        setLiked(like.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [like, currentUser.uid]);

    const HandleLike = async (id) => {
        if (currentUser && currentUser.uid) {
            const likeRef = doc(db, "UserPostPhoto", id, "likes", currentUser.uid);
            const likeDoc = await getDoc(likeRef);

            if (likeDoc.exists()) {
                await deleteDoc(likeRef);
            } else {
                await setDoc(likeRef, {
                    userUid: currentUser.uid,
                    name: currentUser.displayName
                });
            }
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }
    }

    const ViewLikes = (id) => {
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'none') {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    };

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

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


    const [api, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const colRef = collection(db, 'users');
        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setApiData(newApi);
                setLoading(false);
            });

            return () => {
                unsubscribe();
            };
        }, 1000);

        return () => clearTimeout(delay);
    }, []);

    const [isShare, setIsShare] = useState(false);
    const HandleShare = () => {
        setIsShare(!isShare);
    }

    const [isSelected, setIsSelected] = useState(false);
    const [selectedUid, setSelectedUid] = useState(null);
    const [selectedImg, setSelectedImg] = useState(null);
    const [selectedName, setSelectedName] = useState("");
    const [selectedVideo, setSelectedVideo] = useState(null);


    const HandleSendReel = (item, video) => {
        setSelectedUid(item.uid);
        setIsSelected(!isSelected);
        setSelectedImg(item.PhotoUrl);
        setSelectedName(item.name);
        setSelectedVideo(video);
    }

    const SendReelClose = () => {
        setIsSelected(false);
        setSelectedImg(null);
        setSelectedName("");
        setSelectedUid(null);
        setSelectedVideo(null);
        setIsShare(false);
    }
    const HandleSendReelClose = () => {
        setIsSelected(!isSelected);
        setSelectedImg(null);
        setSelectedName("");
        setSelectedUid(null)
    }

    const sendMessage = async (uid, name, recipientImg) => {
        try {
            const messagesRef = collection(db, 'messages');
            const currentUser = auth.currentUser;

            if (selectedVideo) {
                await addDoc(messagesRef, {
                    sender: currentUser.uid,
                    senderImg: currentUser.photoURL,
                    recipient: selectedUid,
                    recipientImg: selectedImg,
                    sound: "on",
                    videoUrl: selectedVideo,
                    timestamp: serverTimestamp(),
                });
            }

            const messageData1 = {
                userId: currentUser.uid,
                name: currentUser.displayName,
                photoUrl: currentUser.photoURL,
                status: "unseen",
                sound: "on",
                photo: "unseen",
                time: serverTimestamp(),

            };

            const messageData2 = {
                userId: selectedUid,
                name: selectedName,
                photoUrl: selectedImg,
                status: "unseen",
                sound: "on",
                time: serverTimestamp(),
            };

            const docRef1 = doc(db, `allFriends/${selectedUid}/Message`, currentUser.uid);
            const docRef2 = doc(db, `allFriends/${currentUser.uid}/Message`, selectedUid);

            const promises = [];

            promises.push(setDoc(docRef1, messageData1, { merge: true }));
            promises.push(setDoc(docRef2, messageData2, { merge: true }));

            await Promise.all(promises);
            HandleSendReelClose();
            SendReelClose();


        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const newarrytwo = api.filter((item) =>
        friendsList.some((friend) => item.uid === friend.uid)
    );

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

    return (
        <div className="reel-scroll-div">
            <div className="reel-mainu-div">
                <video ref={videoRef} className="rvideo" onClick={() => handleVideoBtnClick(post.id)} >
                    <source src={post.img} type="video/mp4" />
                </video>
                {!isPlaying && (
                    <a className="intro-banner-vdo-play-btn" onClick={() => handleVideoBtnClick(post.id)} target="_blank">
                        <div className="play-button">
                            <FaPlay className="play-button" />
                        </div>
                    </a>
                )}

                <div className="reels-back-button text-lightProfileName dark:text-darkProfileName">
                    <i onClick={goBack} className="bi bi-arrow-left "></i>
                </div>

                <div className="reel-like-share">
                    <FaShare onClick={HandleShare} />
                </div>

                <div className="reel-like-icon">
                    {liked ? <BsHeartFill color='#FF0040' className='' onClick={() => HandleLike(post.id)} /> :
                        <BsHeartFill className='unlike-heart' onClick={() => HandleLike(post.id)} />
                    }
                    <div className='like-count ' onClick={() => ViewLikes(post.id)}>{isliked.length}</div>
                </div>

                <div className="reel-profile-div">
                    <img src={post.photoURL} className='reel-profile-img' alt="" />
                </div>

                {isShare ?
                    (<>
                        {isSelected ?
                            (<>
                                <div className="selected-id">
                                    <div className="selected-id-close-div">
                                        <CgClose className='selected-id-close-icon' onClick={HandleSendReelClose} />
                                    </div>
                                    <img src={selectedImg} className='selected-img' alt="" />
                                    <div className="selected-name">{selectedName}</div>
                                    <button className="btn btn-primary btn-md w-25" onClick={sendMessage} style={{ fontSize: "16px", }}>Send</button>
                                </div>
                            </>)
                            :
                            (<>
                                <div className="send-reel-div">
                                    <div className="send-reel-close-div">
                                        <CgClose className='send-reel-close-icon' onClick={SendReelClose} />
                                    </div>
                                    <div className="send-reel-grid-div">
                                        <div className="send-reel-grid">

                                            {newarrytwo
                                                .map((friend) => {

                                                    return (
                                                        <div key={friend.uid} >
                                                            <div className='w-100' style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                                                                <img onClick={() => HandleSendReel(friend, post.img)} src={friend.PhotoUrl} className='ree-friend-img' alt="" />
                                                                <div className='reel-friend-name text-lightProfileName dark:text-darkProfileName'>{friend.name}</div>
                                                            </div>

                                                        </div>
                                                    )

                                                })}

                                        </div>
                                    </div>
                                </div>
                            </>)
                        }
                    </>)
                    :
                    null
                }

            </div>
        </div>
    );
};

const Reals = () => {
    const [userPhoto, setUserPhoto] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const colRef = collection(db, 'UserPostPhoto');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setUserPhoto(fetchedPosts);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const isVideo = (filename) => {
        const videoExtensions = ['mp4'];
        const extension = getFileExtension(filename);
        return videoExtensions.includes(extension);
    };


    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const shuffledUserPhoto = shuffleArray(userPhoto);


    const VideoData = shuffledUserPhoto.map((post) => {
        return (
            <React.Fragment key={post.id}>
                {post.img && isVideo(post.name) && <VideoItem post={post} />}
            </React.Fragment>
        );
    });

    return (
        <>
            <div className="reel-container bg-light_0 dark:bg-dark">
                {VideoData}
            </div >
        </>
    );
};

export default Reals;
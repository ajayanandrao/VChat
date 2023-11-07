import React, { useEffect, useState, useRef, useContext } from 'react';
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';

import './Reals.scss';
import { FaPlay } from 'react-icons/fa';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineHeart } from 'react-icons/ai';
import { BsBalloonHeart, BsBalloonHeartFill, BsFillHeartFill, BsHeart, BsHeartFill, BsHearts } from 'react-icons/bs';
import { AuthContext } from '../AuthContaxt';
import { useNavigate } from 'react-router-dom';
import Heart from "react-animated-heart";
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

    return (
        <div className="reel-scroll-div">
            <div className="reel-mainu-div">
                <video ref={videoRef} className="rvideo" onClick={() => handleVideoBtnClick(post.id)} loop>
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

                <div className="reel-like-icon">

                    {liked ? <BsHeartFill color='#FF0040' className='' onClick={() => HandleLike(post.id)} /> :
                        <BsHeartFill className='unlike-heart' onClick={() => HandleLike(post.id)} />
                    }
                    <div className='like-count ' onClick={() => ViewLikes(post.id)}>{isliked.length}</div>
                </div>

                <div className="reel-profile-div">
                    <img src={post.photoURL} className='reel-profile-img' alt="" />
                </div>
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


    const VideoData = userPhoto.map((post) => {
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
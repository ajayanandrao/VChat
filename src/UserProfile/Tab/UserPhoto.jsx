import React, { useContext, useEffect, useRef, useState } from 'react'
import "./UserPhoto.scss";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { FiMaximize } from "react-icons/fi"
import { MdDelete } from "react-icons/md"
import { IoMdClose } from "react-icons/io"
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai'

const UserPhoto = () => {

    const { currentUser } = useContext(AuthContext);
    const [userPhoto, setUserPhoto] = useState([]);
    const [photoTime, setPhotoTime] = useState("");

    useEffect(() => {
        const colRef = collection(db, 'UserPostPhoto');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setUserPhoto(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const isImage = (filename) => {
        const imageExtensions = ['jpg', 'jpeg', 'png'];
        const extension = getFileExtension(filename);
        return imageExtensions.includes(extension);
    };

    const ViewPhoto = (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
    }
    const closeViewPhoto = (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
    };
    const deletePhoto = async (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
        const colRef = doc(db, 'UserPostPhoto', id);
        await deleteDoc(colRef);

    };


    const formatTimestamp = (timestamp) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(timestamp.toDate());
    };


    const newData = userPhoto.map((post) => {
        if (post.uid === currentUser.uid) {

            return (
                <div key={post.id}>

                    <div id={`ViewImg${post.id}`} style={{ display: "none" }}
                        className='ViewImg' >

                        <div className="viewImg-relative">

                            <div className="viewimg-option">

                                <div className='viewimg-option-inner-div'>
                                    <div className='viewimg-option-delete'>

                                        <div className="photo-time">{formatTimestamp(post.bytime)}</div>
                                        <MdDelete style={{ fontSize: "26px", color: "white" }} onClick={() => deletePhoto(post.id)} />
                                    </div>
                                    <div className='viewimg-option-close'>
                                        <AiOutlineClose style={{ fontSize: "20px" }} onClick={() => closeViewPhoto(post.id)} />
                                    </div>


                                </div>
                            </div>

                            <div className='viewimg-div'>
                                <img src={post.img} className='viewimg' alt="" />
                            </div>
                        </div>
                    </div>

                    <img src={post.image} alt="" />

                    {post.img && isImage(post.name) ?
                        (
                            <div key={post.id} onClick={() => { ViewPhoto(post.id) }}
                                className='photo-card'
                                style={{ backgroundImage: `url(${post.img})` }}>

                            </div >
                        )
                        :
                        null
                    }
                </div>
            );
        }
    });

    const isVideo = (filename) => {
        const videoExtensions = ['mp4'];
        const extension = getFileExtension(filename);
        return videoExtensions.includes(extension);
    };


    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef([]);

    const [videoShow, setVideoShow] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [time, setTime] = useState(null);

    const handleVideoShow = (id, url, time) => {
        setVideoShow(!videoShow);
        setVideoId(id);
        setVideoUrl(url);
        setTime(time);
    }

    const handleVideoBtnClick = () => {
        const video = videoRef.current[videoId];
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };


    const VideoData = userPhoto.map((post) => {
        if (post.uid === currentUser.uid) {
            return (
                <>

                    {post.img && isVideo(post.name) && (
                        <>
                            <div className='video-container'>
                                <video className='UserVideo'
                                    onClick={() => handleVideoShow(post.id, post.img, post.bytime)}  >
                                    <source src={post.img} type="video/mp4" />
                                </video>
                            </div>
                        </>
                    )
                    }
                </>
            )
        }
    });

    const deleteVideo = async () => {
        const colRef = doc(db, 'UserPostPhoto', videoId);
        await deleteDoc(colRef);
        handleVideoShow();
    };



    const mediaRef = collection(db, 'CurrentUserMedia');
    const [imageMedia, setImageMedia] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(mediaRef, (snapshot) => {
            setImageMedia(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);

    return (
        <>

            {/* {videoShow ?
                <div className='current-Profile-video-Overlay'>
                    <div className="video-overlay-close">
                        <div className="video-overlay-time-div">
                            <div className="photo-time me-3">{formatTimestamp(time)}</div>
                            <MdDelete style={{ fontSize: "26px" }} onClick={deleteVideo} />
                        </div>
                        <div className="video-overlay-close-div">
                            <div onClick={handleVideoShow}>
                                <AiOutlineClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                    </div>
                    <div className='video-div'>
                        <div className='video-container' >
                            <video className='UserVideo' ref={(el) => (videoRef.current[videoId] = el)} onClick={handleVideoBtnClick} >
                                <source src={videoUrl} type="video/mp4" />
                            </video>
                        </div>
                    </div>
                </div>
                :
                null
            } */}
            {/* <div class="photo-grid-parent-container">
                <div className="grid-container" >
                    {newData}
                </div>
            </div> */}

            {/* {imageMedia.map((item) => {
                return (
                    <>
                        <div className='video-container'>
                            <video className='UserVideo'>
                                <source src={item.video} type="video" />
                            </video>
                        </div>
                        <img src={item.image} alt="" />
                    </>
                )
            })}

            <h3 className='video-text text-2xl text-lightPostText dark:text-darkPostText'>Video</h3> */}

            {/* {VideoData} */}
        </>

    )
}


export default UserPhoto
{/* <div className='photo-card' style={{ backgroundImage: `url(${ post.img })` }}></div> */ }
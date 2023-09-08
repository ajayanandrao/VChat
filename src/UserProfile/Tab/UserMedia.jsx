import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { db } from '../../Firebase';
import "./UserMedia.scss";
import { FaPlay } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { AuthContext } from '../../AuthContaxt';

const UserMedia = () => {
    const { currentUser } = useContext(AuthContext);
    const videoRef = useRef([]);
    const [imageMedia, setImageMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const mediaRef = collection(db, 'UserPostPhoto');

    useEffect(() => {
        const unsub = onSnapshot(query(mediaRef, orderBy('bytime', 'desc')), (snapshot) => {
            setImageMedia(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setIsLoading(false); // Set isLoading to false when data is fetched
        });

        return unsub;
    }, []);

    const formatTimestamp = (timestamp) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(timestamp.toDate());
    };


    const [ImageShow, setImageShow] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageId, setImageId] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [videoShow, setVideoShow] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [time, setTime] = useState(null);

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

    const handleImageShow = (id, url, time) => {
        setImageShow(!ImageShow);
        setImageId(id);
        setImageUrl(url);
        setTime(time);
    }
    const handleVideoShow = (id, url, time) => {
        setVideoShow(!videoShow);
        setVideoId(id);
        setVideoUrl(url);
        setTime(time);
    }

    const deleteImage = async () => {
        const colRef = doc(db, 'UserPostPhoto', imageId);
        await deleteDoc(colRef);
        handleImageShow();
    };

    const deleteVideo = async () => {
        const colRef = doc(db, 'UserPostPhoto', videoId);
        await deleteDoc(colRef);
        handleVideoShow();
    };


    return (
        <>
            {ImageShow ?
                <div className='current-Profile-video-Overlay'>
                    <div className="video-overlay-close">
                        <div className="video-overlay-time-div">
                            <div className="photo-time me-3">{formatTimestamp(time)}</div>
                            <MdDelete style={{ fontSize: "26px" }} onClick={deleteImage} />
                        </div>
                        <div className="video-overlay-close-div">
                            <div onClick={handleImageShow}>
                                <AiOutlineClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                    </div>
                    <div className='video-div'>
                        <img src={imageUrl} alt="" />
                    </div>
                </div>
                :
                null
            }


            {videoShow ?
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

                        <video className='UserVideo' autoPlay controls preload='auto' ref={(el) => (videoRef.current[videoId] = el)} onClick={handleVideoBtnClick} >
                            <source src={videoUrl} type="video/mp4" />
                        </video>

                    </div>
                </div>
                :
                null
            }



            {/*  */}

            <div className='media-container'>
                <div class="photo-grid-parent-container">
                    <div className="grid-container" >
                        {imageMedia.map((post) => {
                            if (currentUser.uid === post.uid)
                                return (
                                    (
                                        <>
                                            {
                                                post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                                                    <img src={post.img} alt="Uploaded" className="media-img" onClick={() => handleImageShow(post.id, post.img, post.bytime)} />
                                                ) : post.img ? (
                                                    <>

                                                        <div className="mediaVideo-background" onClick={() => handleVideoShow(post.id, post.img, post.bytime)}>
                                                            <video className="media-video"  >
                                                                <source src={post.img} type="video/mp4" />
                                                            </video>
                                                            <div className="mediaVideo-btn-div">
                                                                <div className="mediaVideo-btn">
                                                                    <FaPlay className='mediaVideo-icon' />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </>

                                                ) : null
                                            }
                                        </>
                                    )
                                );
                        })}
                    </div>
                </div>

            </div>
        </>
    )
}

export default UserMedia
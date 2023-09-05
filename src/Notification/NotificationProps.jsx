import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { db } from '../Firebase';
import Notification from './Notification';
import { AuthContext } from '../AuthContaxt';
import "./NewNotificationPage.scss";
import { AiFillHeart } from 'react-icons/ai';
import { FaComment, FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotificationProps = () => {
    const { currentUser } = useContext(AuthContext);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
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


    const [notificationData, setNotificationData] = useState([]);

    useEffect(() => {
        const colRef = collection(db, 'Notification');
        const unsubscribe = onSnapshot(query(colRef, orderBy('timestamp', 'desc')), (snapshot) => {
            let newbooks = []
            snapshot.docs.forEach((doc) => {
                newbooks.push({ ...doc.data(), id: doc.id })
            });
            setNotificationData(newbooks);
        });

        return () => unsubscribe();
    }, []);


    function TimeAgoComponent({ timestamp }) {
        const now = new Date().getTime();
        const timeDifference = now - timestamp;
        const seconds = Math.floor(timeDifference / 1000);

        let timeAgo = '';

        if (seconds < 60) {
            timeAgo = `${seconds}s ago`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            timeAgo = `${minutes}m ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            timeAgo = `${hours}h ago`;
        } else {
            const days = Math.floor(seconds / 86400);
            timeAgo = `${days}d ago`;
        }

        return <span>{timeAgo}</span>;
    }

    return (
        <div className='New-Notification-Container dark:bg-dark'>
            {
                notificationData.map((item) => {
                    // if (currentUser && currentUser.uid === item.uid) {
                    return (
                        <div key={item.id}>
                            {item.senderName ?
                                <Link to={`/message/`}>
                                    <div className="n-container">

                                        <div className="n-profile-div dark:bg-darkDiv">
                                            <img src={item.photoUrl} alt="" className='n-profile-img' />
                                            <div className='n-name-and-time-div'>
                                                <div className="n-profile-name dark:text-darkProfileName">{item.name || item.senderName}</div>

                                                <div style={{ display: "flex", alignItems: "center" }}className='dark:text-darkTime'>
                                                    <TimeAgoComponent timestamp={item.timestamp && item.timestamp.toDate()} />
                                                    <div className='ms-3' style={{ fontWeight: "600", color: "#088A85" }} >{item.senderName ? "Friend Request" : null}</div>

                                                </div>
                                            </div>

                                            <div className="islike-div">
                                                {item.like ? (
                                                    <>
                                                        <AiFillHeart className="mobile-nav-bottom-icon" fontSize={"16px"} color='#FF0040' />
                                                    </>
                                                )
                                                    :
                                                    null
                                                }
                                                {item.senderName ? (
                                                    <>
                                                        <FaUserAlt className="mobile-nav-bottom-icon" fontSize={"16px"} color='#088A85' />
                                                    </>
                                                )
                                                    :
                                                    null
                                                }
                                                {item.comment ? (
                                                    <>
                                                        <FaComment className="mobile-nav-bottom-icon" fontSize={"16px"} color='#2E9AFE' />
                                                    </>
                                                )
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>

                                        <div className="n-media-div">

                                            <div className="n-media-div">
                                                {item.img && (item.imgName.includes('.jpg') || item.imgName.includes('.png')) ? (
                                                    <img width={"300px"} src={item.img} alt="Uploaded" className="n-media-img" />
                                                ) : item.img ? (
                                                    <>
                                                        <div className="video-container">
                                                            <video
                                                                ref={videoRef}
                                                                className="n-media-video"
                                                                preload="auto"
                                                                onClick={handleVideoBtnClick}
                                                            >
                                                                <source src={item.img} type="video/mp4" />
                                                            </video>
                                                        </div>
                                                    </>

                                                ) : null}

                                            </div>


                                        </div>
                                    </div>
                                    {/* <Notification post={item} postLike={item.likes} /> */}
                                </Link>
                                :
                                <Link to={`/notification/${item.id}`}>
                                    <div className="n-container">

                                        <div className="n-profile-div dark:bg-darkDiv">
                                            <img src={item.photoUrl} alt="" className='n-profile-img' />
                                            <div className='n-name-and-time-div'>
                                                <div className="n-profile-name dark:text-darkProfileName">{item.name || item.senderName}</div>

                                                <div style={{ display: "flex", alignItems: "center" }} className='dark:text-darkTime'>
                                                    <TimeAgoComponent timestamp={item.timestamp && item.timestamp.toDate()} />
                                                    <div className='ms-3' style={{ fontWeight: "600", color: "#088A85" }} >{item.senderName ? "Friend Request" : null}</div>

                                                </div>
                                            </div>

                                            <div className="islike-div">
                                                {item.like ? (
                                                    <>
                                                        <AiFillHeart className="mobile-nav-bottom-icon" fontSize={"16px"} color='#FF0040' />
                                                    </>
                                                )
                                                    :
                                                    null
                                                }
                                                {item.senderName ? (
                                                    <>
                                                        <FaUserAlt className="mobile-nav-bottom-icon" fontSize={"16px"} color='#088A85' />
                                                    </>
                                                )
                                                    :
                                                    null
                                                }
                                                {item.comment ? (
                                                    <>
                                                        <FaComment className="mobile-nav-bottom-icon" fontSize={"16px"} color='#2E9AFE' />
                                                    </>
                                                )
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>

                                        <div className="n-media-div">

                                            <div className="n-media-div">
                                                {item.img && (item.imgName.includes('.jpg') || item.imgName.includes('.png')) ? (
                                                    <img width={"300px"} src={item.img} alt="Uploaded" className="n-media-img" />
                                                ) : item.img ? (
                                                    <>
                                                        <div className="video-container">
                                                            <video
                                                                ref={videoRef}
                                                                className="n-media-video"
                                                                preload="auto"
                                                                onClick={handleVideoBtnClick}
                                                            >
                                                                <source src={item.img} type="video/mp4" />
                                                            </video>
                                                        </div>
                                                    </>

                                                ) : null}

                                            </div>


                                        </div>
                                    </div>
                                    {/* <Notification post={item} postLike={item.likes} /> */}
                                </Link>
                            }
                        </div>

                    );
                    // }
                    return null;
                })
            }
        </div>
    )
}

export default NotificationProps

import React, { useContext, useEffect, useState } from 'react'
import { AiFillHeart, AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { MdMovieFilter } from "react-icons/md";
import { AuthContext } from "../AuthContaxt";

import "./MobileNavbarBottom.scss";
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import PostComponentProps from '../Notification/PostComponentProps';

const MobileNavbarBottom = ({ post }) => {
    const { currentUser } = useContext(AuthContext);

    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        const colRef = collection(db, 'NewFriendRequests')
        const userlist = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setFriendRequests(newbooks);
            })
        };
        return userlist();
    }, []);
    const [notification, setNotification] = useState([]);

    useEffect(() => {
        const colRef = collection(db, 'Notification')
        const userlist = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setNotification(newbooks);
            })
        };
        return userlist();
    }, []);


    // const [isLiked, setIsliked] = useState([]);

    // useEffect(() => {
    //     const unsubscribe = onSnapshot(
    //         query(collection(db, 'AllPosts', post.id, 'Notification')
    //         ),
    //         (snapshot) => {
    //             setIsliked(
    //                 snapshot.docs.map((doc) => ({
    //                     id: doc.id,
    //                     ...doc.data(),
    //                 }))
    //             );
    //         }
    //     );

    //     return unsubscribe;
    // }, [post.id]);

    const latestFriendRequest = friendRequests.reduce((latest, current) => {
        if (current.receiverUid === currentUser.uid && current.timestamp > latest.timestamp) {
            return current;
        }
        return latest;
    }, { timestamp: 0 });


    const latestFriendNotification = notification.reduce((latest, current) => {
        if (current.postSenderUid === currentUser.uid && current.timestamp > latest.timestamp) {
            return current;
        }
        return latest;
    }, { timestamp: 0 });


    const [showLatestRequest, setShowLatestRequest] = useState(latestFriendRequest.timestamp > 0);

    useEffect(() => {
        setShowLatestRequest(latestFriendRequest.timestamp > 0);
    }, [latestFriendRequest]);


    const handleCircleClick = () => {
        setShowLatestRequest(false);
    };
    const handleNotificationClick = async () => {
        await updateDoc(doc(db, "Notification", latestFriendNotification.id), {
            isUnRead: false,
        });

    };

    return (
        <>
            <div className="bottom-navbar-container">
                <Link to={"home/"}>
                    <AiFillHome className='mobile-nav-bottom-icon' />
                </Link>
                {/* <PostComponentProps /> */}

                <Link to="notification" onClick={handleNotificationClick}>
                    <div className='mobile-nav-bottom-icon-div'>
                        <AiFillHeart className="mobile-nav-bottom-icon" />
                        <div className='mobile-nav-bottom-notification'>

                            {latestFriendNotification.timestamp > 0 && (
                                <div className="animated-circle" >
                                    {latestFriendNotification.isUnRead == true ?
                                        <AiFillHeart className="mobile-nav-bottom-icon" color='#FF0040' />
                                        :
                                        null}
                                </div>
                            )}
                        </div>

                    </div>
                </Link>

                <Link to="message/" onClick={handleCircleClick} >
                    <div className='mobile-nav-bottom-icon-div'>
                        <i className="bi bi-messenger"></i>

                        <div className='message-mobile-nav-bottom-notification' >
                            {friendRequests.length > 0 ?
                                (<>
                                    {showLatestRequest && latestFriendRequest.timestamp > 0 && (
                                        <div className="message-animated-circle" key={latestFriendRequest.id} onClick={handleCircleClick}>
                                            <img src={latestFriendRequest.senderPhotoUrl} className="request-notification-img" alt="" />
                                        </div>
                                    )}
                                </>)
                                :
                                null
                            }
                        </div>
                    </div>
                </Link>

                <Link to="reels">
                    <div>
                        {/* <img src={video} className="mobile-nav-icons" alt="" /> */}
                        <MdMovieFilter className="mobile-nav-bottom-icon" />
                    </div>
                </Link>
                <Link to={"profile/"}>
                    <div>
                        <img
                            src={currentUser && currentUser.photoURL}
                            alt=""
                            className="mobile-nav-bottom-photo"
                        />
                    </div>
                </Link>
            </div>
        </>
    )
}

export default MobileNavbarBottom
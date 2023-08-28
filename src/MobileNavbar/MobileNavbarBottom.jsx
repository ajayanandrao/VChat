import React, { useContext, useEffect, useState } from 'react'
import { AiFillHeart, AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { MdMovieFilter } from "react-icons/md";
import { AuthContext } from "../AuthContaxt";

import "./MobileNavbarBottom.scss";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';

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


    return (
        <>
            <div className="bottom-navbar-container">
                <Link to={"home/"}>
                    <AiFillHome className='mobile-nav-bottom-icon' />
                </Link>

                <Link to="notification">
                    <div className='mobile-nav-bottom-icon-div'>
                        <AiFillHeart className="mobile-nav-bottom-icon" />
                        <div className='mobile-nav-bottom-notification'>
                                
                        </div>
                    </div>
                </Link>

                <Link to="message/">
                    <div className='mobile-nav-bottom-icon-div'>
                        <i className="bi bi-messenger"></i>

                        <div className='message-mobile-nav-bottom-notification' >
                            {friendRequests.length > 0 ?
                                (<>
                                    {friendRequests.map((item) => {
                                        if (item.receiverUid == currentUser.uid) {
                                            return (
                                                <>
                                                    <div className="message-animated-circle">
                                                    </div>
                                                </>
                                            )
                                        }
                                    })}
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
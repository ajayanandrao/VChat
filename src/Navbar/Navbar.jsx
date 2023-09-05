import React, { useContext, useEffect, useState } from 'react'
import "./Navbar.scss";
import "./../MobileNavbar/MobileNavbarBottom.scss";
import { AiFillHeart, AiFillHome } from "react-icons/ai"
import { MdMovieFilter } from 'react-icons/md';
import { BsMessenger } from 'react-icons/bs';
import { RiMessengerFill } from 'react-icons/ri';
import { AuthContext } from '../AuthContaxt';
import { motion, useAnimation } from 'framer-motion';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { Link } from 'react-router-dom';



const Navbar = () => {
    const { currentUser } = useContext(AuthContext);

    const [view, setView] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const handleBoll = () => {
        setView(!view);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollUp = prevScrollPos > currentScrollPos;

            setPrevScrollPos(currentScrollPos);

            // Calculate scroll percentage
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (currentScrollPos / scrollHeight) * 100;

            // Define thresholds for showing and hiding navbar
            const hideThreshold = 0.5; // Hide navbar when scrolled down 10% or more
            const showThreshold = 0.1; // Show navbar when scrolled up 1% or more

            setShowNavbar(
                (scrollUp && scrollPercentage > showThreshold) || // Show on scroll up
                (!scrollUp && scrollPercentage < hideThreshold) || // Show on scroll down
                currentScrollPos === 0 // Always show at the top

            );
            if ((scrollUp && scrollPercentage > showThreshold) || // Show on scroll up
                (!scrollUp && scrollPercentage < hideThreshold) || currentScrollPos === 0) {
                setView(false);
            } else {
                setView(false);
            }


        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    // Scroll part end --------------------------

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
        <div className='navbar-main-container'>

            <div className='navbar-mainu-button' onClick={() => { handleBoll() }} >
                <div class="intro-banner-vdo-play-btn pinkBg" target="_blank" onClick={handleBoll}>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                </div>
            </div>


            <div className="circle-div">

                {view ?
                    <Link
                        to={"/reels"} className="navbar-mainu-link-btn c-video c-reel" onClick={handleBoll}>
                        <div
                            className="">
                            <motion.div style={{
                                width: "40px", height: "40px", borderRadius: "50%", display: "flex",
                                justifyContent: "center", alignItems: "center"
                            }}
                                transition={{ duration: 0.3, delay: 0 }}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className='link-btn-shadow'
                            >
                                <MdMovieFilter />
                            </motion.div>
                        </div>
                    </Link>
                    :
                    null
                }


                {view ?
                    <Link
                        to={"/notification/"} className="navbar-mainu-link-btn c-heart " onClick={() => { handleNotificationClick(); handleBoll(); }}>
                        <div
                            className="">
                            {latestFriendNotification.timestamp > 0 && (
                                <div className="" >
                                    {latestFriendNotification.isUnRead == true ?
                                        <motion.div style={{
                                            width: "40px", height: "40px", borderRadius: "50%", display: "flex",
                                            justifyContent: "center", alignItems: "center"
                                        }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                            initial={{ scale: 0.6, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className='link-btn-shadow' >
                                            <AiFillHeart className="" color='#FF0040' onClick={() => { handleNotificationClick(); handleBoll(); }} />
                                        </motion.div>
                                        :
                                        <AiFillHeart />}
                                </div>
                            )}
                        </div>
                    </Link>
                    :
                    null
                }

                {view ?
                    <Link to={"/home/"} className="navbar-mainu-link-btn c-home" onClick={() => { handleBoll(); }}>
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.3 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="link-btn-shadow">
                            <motion.div style={{
                                width: "40px", height: "40px", borderRadius: "50%", display: "flex",
                                justifyContent: "center", alignItems: "center"
                            }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <AiFillHome />
                            </motion.div>
                        </motion.div>

                    </Link>
                    :
                    null
                }

                {view ?
                    <Link to={"/message/"} onClick={() => { { handleCircleClick(); handleBoll(); } }} className="navbar-mainu-link-btn c-chat" >
                        <div className="link-btn-shadow">
                            <motion.div style={{
                                width: "40px", height: "40px", borderRadius: "50%", display: "flex",
                                justifyContent: "center", alignItems: "center"
                            }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <RiMessengerFill style={{ position: "absolute", fontSize: "24px" }} />
                                <Link to={"/message/"} >
                                    <div className='link-btn-shadow'  >
                                        {friendRequests.length > 0 ?
                                            (<>
                                                {showLatestRequest && latestFriendRequest.timestamp > 0 && (
                                                    <div className="message-animated-circle link-btn-shadow" key={latestFriendRequest.id} >
                                                        <img src={latestFriendRequest.senderPhotoUrl}
                                                            className="request-notification-img" alt="" />
                                                    </div>
                                                )}
                                            </>)
                                            :
                                            <RiMessengerFill />
                                        }
                                    </div>
                                </Link>

                            </motion.div>
                        </div>
                    </Link>
                    :
                    null
                }


                {
                    view ?
                        <Link to={"/profile/"} className="navbar-mainu-link-btn c-profile-img-position" onClick={handleBoll}>
                            <motion.div
                                transition={{ duration: 0.3, delay: 0.5 }}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="link-btn-shadow" onClick={handleBoll}>
                                <img src={currentUser && currentUser.photoURL} className='c-profile-img' alt="" />
                            </motion.div>
                        </Link>
                        :
                        null
                }
            </div >


        </div >
    )
}

export default Navbar
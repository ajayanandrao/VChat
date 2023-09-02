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
        <div>

            <div className='boll' onClick={() => { handleBoll() }} >
                <div class="intro-banner-vdo-play-btn pinkBg" target="_blank" onClick={handleBoll}>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                </div>
            </div>


            <div className="sideNavbar">
                <div className="circle-div">
                    {view ?


                        <motion.div
                            transition={{ duration: 0.3, delay: 0.2 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-home">
                            <Link to={"/home/"} className="c-home" style={{ boxShadow: "none", backdropFilter: "none" }}>
                                <AiFillHome />
                            </Link>
                        </motion.div>

                        :
                        null
                    }
                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.1 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-heart">
                            <Link to={"/notification/"} className="c-home" style={{ boxShadow: "none", backdropFilter: "none" }}>
                                <AiFillHeart />
                            </Link>
                            {latestFriendNotification.timestamp > 0 && (
                                <div className="animated-circle" >
                                    {latestFriendNotification.isUnRead == true ?
                                        <Link to={"/notification/"} onClick={handleNotificationClick} >
                                            <AiFillHeart className="mobile-nav-bottom-icon" color='#FF0040' />
                                        </Link>
                                        :
                                        null}
                                </div>
                            )}
                        </motion.div>
                        :
                        null
                    }

                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-video">
                            <Link to={"/reels"} className="c-home" style={{ boxShadow: "none", backdropFilter: "none" }}>
                                <MdMovieFilter />
                            </Link>

                        </motion.div>
                        :
                        null
                    }

                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.3 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-sms">
                            <Link to={"/message/"} onClick={handleCircleClick} className="c-home" style={{ boxShadow: "none", backdropFilter: "none" }}>
                                <RiMessengerFill />
                            </Link>
                            <div className='message-mobile-nav-bottom-notification' >
                                {friendRequests.length > 0 ?
                                    (<>
                                        {showLatestRequest && latestFriendRequest.timestamp > 0 && (
                                            <div className="message-animated-circle" key={latestFriendRequest.id} >
                                                <Link to={"/message/"} onClick={handleCircleClick} className="c-home" style={{ boxShadow: "none", backdropFilter: "none" }}>
                                                    <img src={latestFriendRequest.senderPhotoUrl} className="request-notification-img" alt="" />
                                                </Link>
                                            </div>
                                        )}
                                    </>)
                                    :
                                    null
                                }
                            </div>
                        </motion.div>
                        :
                        null
                    }

                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.4 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-profile">
                            <Link to={"/profile/"} className="c-home" style={{ boxShadow: "none", backdropFilter: "none" }}>
                                <img src={currentUser && currentUser.photoURL} className='c-profile-img' alt="" />
                            </Link>
                        </motion.div>
                        :
                        null
                    }
                </div>
            </div>

        </div >
    )
}

export default Navbar
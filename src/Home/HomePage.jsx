import { signOut } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase';
import "./HomePage.scss";
import v from "./../Image/img/logo192.png";
import { MdAddReaction } from 'react-icons/md';
import { BsFillPeopleFill, BsFillPlusCircleFill, BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { RiSearchLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import Feed from '../Feed/Feed';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import Post from '../Post/Post';
import StoryForm from '../Story/StoryForm';
import { AiFillMinusCircle, AiOutlineArrowUp } from 'react-icons/ai';
import { motion, useAnimation } from 'framer-motion';
import Left from './Left/Left';
import MobileNavebar from '../MobileNavbar/MobileNavebar';

const HomePage = () => {
    const nav = useNavigate();

    const LogOut = async () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });
        nav("/");
    };

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRight, setLoadingRight] = useState(true);
    useEffect(() => {
        const colRef = collection(db, 'users');

        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setUsers(newApi);
                setLoadingRight(false);
            });

            return () => {
                // Cleanup the subscription when the component unmounts
                unsubscribe();
            };
        }, 1000);
        return () => clearTimeout(delay);
    }, []);

    const [api, setApiData] = useState([]);
    const { currentUser } = useContext(AuthContext);


    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setApiData(fetchedPosts);
            setLoading(false); // Set loading to false once data is fetched
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const [search, setSearch] = useState("");


    const [check, setCheck] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'NewFriendRequests')
        const userlist = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setCheck(newbooks);
            })
        };
        return userlist();
    }, []);

    const sendFriendRequest = async (id, otherUserId, otherUserName, otherUserPhotoUrl) => {
        try {
            const newFriendRequestDocRef = await addDoc(collection(db, 'NewFriendRequests'), {
                senderId: currentUser.uid,
                senderName: currentUser.displayName,
                senderPhotoUrl: currentUser.photoURL,

                receiverPhotoUrl: otherUserPhotoUrl,
                receiverUid: otherUserId,
                receiverName: otherUserName,
                status: 'pending',
                timestamp: serverTimestamp(),
            });

            // Retrieve the unique ID and update the friend request document with it
            const newFriendRequestId = newFriendRequestDocRef.id;
            await updateDoc(newFriendRequestDocRef, { mainid: newFriendRequestId });

            // Create a notification document with the same mainid
            await setDoc(doc(db, "Notification", newFriendRequestId), {
                senderId: currentUser.uid,
                senderName: currentUser.displayName,
                photoUrl: currentUser.photoURL,

                receiverPhotoUrl: otherUserPhotoUrl,
                postSenderUid: otherUserId,
                receiverName: otherUserName,
                status: 'pending',
                timestamp: serverTimestamp(),
                isUnRead: true,
                mainid: newFriendRequestId,
            });

            console.log('Friend request sent successfully!', id);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const cancelFriendRequest = async (id, senderId, otherUserId) => {

        console.log("recipientId :-", otherUserId);
        console.log("sender :-", senderId);

        try {
            const friendRequestsRef = collection(db, 'NewFriendRequests');
            const querySnapshot = await getDocs(friendRequestsRef);

            querySnapshot.forEach(async (doc) => {
                const request = doc.data();
                if (request.senderId === senderId && request.receiverUid === otherUserId && request.status === 'pending') {
                    deleteDoc(doc.ref);
                    console.log('Friend request canceled.');

                    const notificationRef = collection(db, 'Notification');
                    const notificationQuerySnapshot = await getDocs(notificationRef);
                    notificationQuerySnapshot.forEach(async (notificationDoc) => {
                        const notificationData = notificationDoc.data();
                        if (notificationData.senderId === senderId &&
                            notificationData.postSenderUid === otherUserId
                            && (notificationData.status === 'pending' || notificationData.status === 'accepted')) {
                            await deleteDoc(notificationDoc.ref);
                            console.log('Notification deleted.');
                        }
                    });
                }
            });

            //delete Notification 
            const notificationRef = collection(db, 'Notification');

        } catch (error) {
            console.error('Error canceling friend request:', error);
        }
    };

    const [friendsList, setFriendsList] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    useEffect(() => {
        const friendsRef = collection(db, `allFriends/${currentUser.uid}/Friends`);
        const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
            const newFriendsList = snapshot.docs.map((doc) => doc.data());
            setFriendsList(newFriendsList);
            setDataFetched(true);
        });

        return unsubscribe;
    }, []);

    const isFriend = (userId) => {
        return friendsList.some((friend) => friend.userId === userId);
    };

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(
                    collection(db, `allFriends/${currentUser.uid}/Message`),
                    orderBy('time', 'asc') // Reverse the order to show newest messages first
                );

                const unsubscribe = onSnapshot(friendsQuery, (friendsSnapshot) => {
                    const friendsData = friendsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    // Reverse the order of messages to show newest messages first
                    setMessages(friendsData.reverse());
                });

                // Return the unsubscribe function to stop listening to updates when the component unmounts
                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);

    const HandleSmsSeen = (id) => {
        const smsRef = doc(db, `allFriends/${currentUser.uid}/Message/${id}`); // Include the document ID here

        updateDoc(smsRef, {
            status: "seen"
        })
            .then(() => {
                console.log("Message marked as seen successfully.");
            })
            .catch((error) => {
                console.error("Error marking message as seen:", error);
            });
    };


    return (
        <div className='homepage-main-container bg-light_0 dark:bg-dark'>
            <motion.div
                transition={{ duration: 0.3, delay: 0.8 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='btn' onClick={handleScrollToTop} id='scrollTopBtn'>
                <AiOutlineArrowUp className='top-arrow text-aqua_0 ' />
            </motion.div>

            {/* <div className="left">
                <Link to="/home/" style={{ textDecoration: "none" }}>
                    <img src={v} className='logov-left-navbar' alt="" />
                </Link>

                <Link to="/createStory/" className="link">
                    <div className="story-left">
                        <MdAddReaction className='left-nav-icon dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>

                <Link to="/find_friend/" className="link">
                    <div className="story-left">
                        <BsFillPeopleFill className='left-nav-icon dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>

                <Link to="/search/" className="link ">
                    <div className="story-left left-search-icon left-search-icon">
                        <RiSearchLine className=' left-nav-icon dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>

                <div className="story-left" onClick={() => { darkTheme(); toggleTheme(); }}>
                    {theme === "dark" ?
                        <BsFillSunFill className="left-nav-icon mobile-nav-icon  dark:text-darkPostIcon" />
                        :
                        <BsMoonStarsFill className="left-nav-icon mobile-nav-icon text-lightPostIcon" />
                    }
                </div>

                <Link to="/option/" className="link">
                    <div className="story-left">
                        <RxHamburgerMenu className='left-nav-icon left-icon-transection dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>
            </div> */}

            {/* <MobileNavebar /> */}

            <div className="left-side"></div>

            <div className="center">
                <div className="center-div">

                    <div className='sms-position-div'>
                        {messages.slice(0, 1).map((sms) => {
                            return (
                                <div key={sms.id}>


                                    <Link to={`/users/${sms.userId}/message`} className='link' onClick={() => HandleSmsSeen(sms.id)}>
                                        {sms.status === "unseen" ? (<div className='sms-div' style={{ width: "80px", height: "80px" }}>
                                            <div className=" sms-user-ring-div" style={{ width: "60px", height: "60px" }}>
                                                {sms.status === "unseen" ? <div className="sms-user-ring " style={{ width: "60px", height: "60px" }}></div> : ""}
                                                <img src={sms.photoUrl} className='sms-user-img' alt="" style={{ width: "50px", height: "50px" }} />
                                            </div>
                                        </div>) : null}
                                    </Link>

                                </div>
                            );

                        })}
                    </div>

                    <StoryForm />
                    <Post />

                    {loading ?
                        <>
                            <div className=' placeholder-glow '>
                                <div className="Feed-Placeholder-card placeholder bg-[white] dark:bg-darkPostIcon">
                                    <div className='d-flex align-items-center'>
                                        <div className='Feed-Placeholder-card-profile bg-lightPostIcon dark:bg-darkDiv'></div>
                                        <div>
                                            <div className='Feed-Placeholder-card-profile-name bg-lightPostIcon dark:bg-darkDiv'></div>
                                            <div className='Feed-Placeholder-card-profile-name-two bg-lightPostIcon dark:bg-darkDiv'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' placeholder-glow '>
                                <div className="Feed-Placeholder-card placeholder bg-[white] dark:bg-darkPostIcon">
                                    <div className='d-flex align-items-center'>
                                        <div className='Feed-Placeholder-card-profile bg-lightPostIcon dark:bg-darkDiv'></div>
                                        <div>
                                            <div className='Feed-Placeholder-card-profile-name bg-lightPostIcon dark:bg-darkDiv'></div>
                                            <div className='Feed-Placeholder-card-profile-name-two bg-lightPostIcon dark:bg-darkDiv'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' placeholder-glow '>
                                <div className="Feed-Placeholder-card placeholder bg-[white] dark:bg-darkPostIcon">
                                    <div className='d-flex align-items-center'>
                                        <div className='Feed-Placeholder-card-profile bg-lightPostIcon dark:bg-darkDiv'></div>
                                        <div>
                                            <div className='Feed-Placeholder-card-profile-name bg-lightPostIcon dark:bg-darkDiv'></div>
                                            <div className='Feed-Placeholder-card-profile-name-two bg-lightPostIcon dark:bg-darkDiv'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' placeholder-glow '>
                                <div className="Feed-Placeholder-card placeholder bg-[white] dark:bg-darkPostIcon">
                                    <div className='d-flex align-items-center'>
                                        <div className='Feed-Placeholder-card-profile bg-lightPostIcon dark:bg-darkDiv'></div>
                                        <div>
                                            <div className='Feed-Placeholder-card-profile-name bg-lightPostIcon dark:bg-darkDiv'></div>
                                            <div className='Feed-Placeholder-card-profile-name-two bg-lightPostIcon dark:bg-darkDiv'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' placeholder-glow '>
                                <div className="Feed-Placeholder-card placeholder bg-[white] dark:bg-darkPostIcon">
                                    <div className='d-flex align-items-center'>
                                        <div className='Feed-Placeholder-card-profile bg-lightPostIcon dark:bg-darkDiv'></div>
                                        <div>
                                            <div className='Feed-Placeholder-card-profile-name bg-lightPostIcon dark:bg-darkDiv'></div>
                                            <div className='Feed-Placeholder-card-profile-name-two bg-lightPostIcon dark:bg-darkDiv'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                        :
                        <>
                            {api.map((item) => {
                                return (
                                    <Feed post={item} key={item.id} />
                                )
                            })}
                        </>
                    }

                </div>
            </div>

            <div className="right-side"></div>

            <div className="right">
                <div className="right-Seatch-User-input-div bg-light_0 dark:bg-dark">
                    <input
                        type="text"
                        className='right-Seatch-User-input dark:bg-darkInput text-lightProfileName dark:text-darkPostText'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder='Search friends '
                    />
                </div>

                <div className="right-user-container">
                    {loadingRight ?
                        (<>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                            <div className='placeholder-glow'>
                                <div className="right-Placeholder-card placeholder">
                                    <div className="right-Placeholder-card-name dark:bg-darkDiv bg-lightPostIcon"></div>
                                    <div className="right-Placeholder-card-name-two dark:bg-darkDiv bg-lightPostIcon"></div>
                                </div>
                            </div>
                        </>) :
                        <>
                            {users
                                .filter((value) => {
                                    if (search === "") {
                                        return value;
                                    } else if (value.name.toLowerCase().includes(search.toLowerCase())) {
                                        return value;
                                    }
                                })
                                .map((item) => {
                                    if (item.uid !== currentUser.uid) {
                                        const friendRequest = check.find(
                                            (request) =>
                                                request.senderId === currentUser.uid &&
                                                request.receiverUid === item.uid &&
                                                request.status === 'pending'
                                        );

                                        const isFriendRequestAccepted = friendsList.some(
                                            (friend) =>
                                                friend.userId === item.uid &&
                                                friend.status === 'accepted'
                                        );

                                        if (isFriendRequestAccepted || isFriend(item.uid)) {
                                            return null; // Skip rendering this user
                                        }

                                        if (dataFetched) {
                                            return (
                                                <div key={item.id}>
                                                    <div className="right-profile-card-div bg-lightDiv dark:bg-darkDiv">
                                                        <Link to={`/users/${item.uid}`} className="right-profile-card-img">
                                                            <div>
                                                                <img src={item.PhotoUrl} className="right-profile-card-img" alt="" />
                                                            </div>
                                                        </Link>
                                                        <div className="right-profile-card-name text-lightProfileName dark:text-darkProfileName mb-2">{item.name}</div>

                                                        <div className="people-name-div">
                                                            <div className="people-btn-div">
                                                                {friendRequest ? (
                                                                    <div
                                                                        id={`cancel-${item.id}`}
                                                                        className="cancel-friend-button"
                                                                        onClick={() =>
                                                                            cancelFriendRequest(
                                                                                item.id,
                                                                                currentUser.uid,
                                                                                item.uid
                                                                            )
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </div>
                                                                ) : isFriendRequestAccepted ? (
                                                                    <div className="friend-request-accepted">Friend Request Accepted</div>
                                                                ) : isFriend(item.uid) ? (
                                                                    <div className="friend-request-accepted">Friend</div>
                                                                ) : dataFetched ? (
                                                                    <div
                                                                        id={`add-${item.id}`}
                                                                        className="add-friend-button"
                                                                        onClick={() =>
                                                                            sendFriendRequest(
                                                                                item.id,
                                                                                item.uid,
                                                                                item.name,
                                                                                item.PhotoUrl
                                                                            )
                                                                        }
                                                                    >
                                                                        Add a friend
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }
                                })}
                        </>}




                </div>
            </div>
        </div>
    );
}

export default HomePage;

import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Message.scss";
// import "./../Styles/flickity.scss";
import { Link, useNavigate } from 'react-router-dom';
// import Flickity from 'react-flickity-component';
import natur from "./nature.json";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db, realdb } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { styled, keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';
import { AuthContext } from './../AuthContaxt';
import { Avatar } from '@mui/material';
import { CircularProgress, LinearProgress } from '@mui/material';
import { off, onValue, ref } from 'firebase/database';


const Message = () => {
    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    const [search, setSearch] = useState("");
    const colRef = collection(db, 'users');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setApiData(newbooks);
            })
        };
        return unsub();
    }, []);

    // online

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const userRef = collection(db, 'OnlyOnline');
        const unsub = () => {
            onSnapshot(userRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setOnlineUsers(newbooks);
            })
        };
        return unsub();
    }, []);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            // border: '1px solid red',
            color: '#44b700',
            boxShadow: `0 0 0 2px `,
            width: '2px',
            height: '8px',
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '100%',
                animation: `${rippleAnimation} 1.2s infinite ease-in-out`,
                border: '1px solid currentColor',
                content: '""',
            },
        },
    }));


    const rippleAnimation = keyframes`
    0% {
      transform: scale(0.2);
      opacity: 1;
    }
    
    100% {
      transform: scale(3);
      opacity: 0;
    }
  `;


    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }
    function openCity(cityName) {
        var i;
        var x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById(cityName).style.display = "block";
    }
    // Friend Request

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


    const DeleteRequest = async (id, senderId, receiverUid) => {
        const RequestRef = doc(db, 'NewFriendRequests', id);
        await deleteDoc(RequestRef);

        const notificationRef = collection(db, 'Notification');
        const notificationQuerySnapshot = await getDocs(notificationRef);
        notificationQuerySnapshot.forEach(async (notificationDoc) => {
            const notificationData = notificationDoc.data();
            if (notificationData.senderId === senderId &&
                notificationData.postSenderUid === receiverUid
                && (notificationData.status === 'pending' || notificationData.status === 'accepted')) {
                await deleteDoc(notificationDoc.ref);
                console.log('Notification deleted.');
            }
        });


    };


    const acceptFriendRequest = async (requestId, senderId, receiverUid,
        senderName, senderPhotoUrl, receiverName, receiverPhotoUrl, mainid) => {
        try {
            const requestRef = doc(db, 'NewFriendRequests', requestId);
            const requestDoc = await getDoc(requestRef);

            if (requestDoc.exists()) {
                await updateDoc(requestRef, { status: 'accepted' });
                console.log('Friend request accepted!');

                // Add sender to receiver's friends list
                await addDoc(collection(db, `allFriends/${receiverUid}/Friends`), {
                    userId: senderId,
                    displayName: senderName,
                    photoUrl: senderPhotoUrl,
                    status: 'accepted',
                    uid: senderId,
                    requestID: mainid,
                });

                // Add receiver to sender's friends list
                await addDoc(collection(db, `allFriends/${senderId}/Friends`), {
                    userId: receiverUid,
                    displayName: receiverName,
                    photoUrl: receiverPhotoUrl,
                    status: 'accepted',
                    uid: receiverUid,
                    requestID: mainid,
                });


                const notificationRef = collection(db, 'Notification');
                const notificationQuerySnapshot = await getDocs(notificationRef);
                notificationQuerySnapshot.forEach(async (notificationDoc) => {
                    const notificationData = notificationDoc.data();
                    if (notificationData.senderId === senderId &&
                        notificationData.postSenderUid === receiverUid
                        && (notificationData.status === 'pending' || notificationData.status === 'accepted')) {
                        await deleteDoc(notificationDoc.ref);
                        console.log('Notification deleted.');
                    }
                });




            } else {
                console.error('Friend request not found.');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }

        const RequestRef = doc(db, 'NewFriendRequests', requestId);
        await deleteDoc(RequestRef);

    };


    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(collection(db, `allFriends/${currentUser.uid}/Friends`));
                const friendsSnapshot = await getDocs(friendsQuery);
                const friendsData = friendsSnapshot.docs.map(doc => doc.data());
                setFriendsList(friendsData);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);

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


    const [uniqueUserIds, setUniqueUserIds] = useState([]);

    useEffect(() => {
        const uniqueIds = messages.reduce((ids, message) => {
            if (!ids.includes(message.userId)) {
                return [...ids, message.userId];
            }
            return ids;
        }, []);
        setUniqueUserIds(uniqueIds);
    }, [messages]);

    const latestFriendRequest = friendRequests.reduce((latest, current) => {
        if (current.receiverUid === currentUser.uid && current.timestamp > latest.timestamp) {
            return current;
        }
        return latest;
    }, { timestamp: 0 });


    const [activeTab, setActiveTab] = useState('Message');
    const setActive = (tabName) => {
        setActiveTab(tabName);
    };

    // ========================================================

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


    function PostTimeAgoComponent({ timestamp }) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

        if (diffInSeconds < 60) {
            return "just now";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}min ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    }

    // useEffect(() => {
    //     const connectionRef = ref(realdb, '.info/connected');

    //     const handleConnectionChange = async (snapshot) => {
    //         if (snapshot.val() === false) {
    //             // alert("Lost connection to the server. Please check your internet connection.");
    //             const PresenceRef = doc(db, "userPresece", currentUser.uid);

    //             await updateDoc(PresenceRef, {
    //                 status: "Offline",
    //             });

    //             const PresenceRefOnline = doc(db, "OnlyOnline", currentUser.uid);
    //             await deleteDoc(PresenceRefOnline);
    //         } else {
    //             // alert("Back online");
    //         }
    //     };

    //     // Set up the listener for connection changes
    //     onValue(connectionRef, handleConnectionChange);

    //     // Clean up the listener when the component unmounts
    //     return () => {
    //         off(connectionRef, handleConnectionChange);
    //     };
    // }, []);


    return (
        <div className='d-flex'>
            <div className="left"></div>
            <div className="message-wrapper bg-light_0 dark:bg-dark">
                <div className="message-wrapper-inner">
                    <div className="wrapper-container">

                        <div className="Message-back-div">
                            <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostIcon"></i>

                        </div>

                        <div className="Message-user-List">

                            <div className="tablink-btn-wrapper">
                                <div className="tablink-btn-inner-wrapper">
                                    <div className={`tablinks text-lightProfileName dark:text-darkPostText  ${activeTab === 'Message' ? 'active' : ''}`} onClick={() => setActive('Message')}> Message</div>
                                    <div className={`tablinks text-lightProfileName dark:text-darkPostText ${activeTab === 'Online' ? 'active' : ''}`} onClick={() => setActive('Online')}>Online</div>
                                    <div className={`tablinks text-lightProfileName dark:text-darkPostText ${activeTab === 'Request' ? 'active' : ''}`} onClick={() => setActive('Request')}>

                                        {latestFriendRequest.timestamp > 0 && (
                                            <div className="request-animated-circle-request me-2"></div>
                                            // <div className="message-animated-circle" key={latestFriendRequest.id}>
                                            // </div>
                                        )}

                                        Request


                                    </div>
                                </div>
                            </div>


                            {activeTab === 'Message' ? (<>
                                <div className='message-tab-container text-lightProfileName dark:text-darkProfileName'>

                                    {messages.map((sms) => {

                                        return (
                                            <div key={sms.id}>
                                                <Link to={`/users/${sms.userId}/message`} className='link'>
                                                    <div className='sms-div'>
                                                        <div className=" sms-user-ring-div">
                                                            {/* {sms.status === "unseen" ? <div className="sms-user-ring"></div> : ""} */}
                                                            <img src={sms.photoUrl} className='sms-user-img' alt="" />

                                                        </div>
                                                        <div className='sms-name' onClick={() => HandleSmsSeen(sms.id)}>{sms.name}</div>
                                                        <PostTimeAgoComponent timestamp={sms.time && sms.time.toDate()} />
                                                    </div>
                                                </Link>
                                            </div>
                                        );

                                    })}

                                    {/* {api.map((item) => {
                                        return (
                                            <div key={item.id}>
                                                {uniqueUserIds.map((userId) => {

                                                    const userMessages = messages.filter((message) => message.userId === userId);
                                                    const user = userMessages[0];
                                                    if (item.uid === user.userId) {
                                                        return (
                                                            <div key={userId}>
                                                                <div className='message-profile-div-one dark:text-darkProfileName'>
                                                                    <Link style={{ textDecoration: "none", display: "flex", alignItems: "center" }} to={`/users/${user.userId}/message`}>
                                                                        <img src={item.PhotoUrl} className='message-user-img' alt='' />
                                                                        <span className='message-user-name text-lightProfileName dark:text-darkProfileName'>{item.name}</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })}

                                                {messages.map((sms) => {
                                                    if (item.uid === sms.id) {
                                                        return (
                                                            <div key={sms.id}>{sms.name}</div>
                                                        );
                                                    }
                                                    return null; // Provide a default case to avoid rendering undefined
                                                })}


                                            </div>
                                        );
                                    })} */}


                                </div>
                            </>) : ''}


                            {activeTab === 'Online' ? (<>
                                <div className='message-tab-container'>
                                    {onlineUsers.length > 0 ? (
                                        onlineUsers.map((online) => {
                                            const isFriendOnline = friendsList.some((friend) => friend.userId === online.uid);
                                            if (isFriendOnline) {
                                                return (
                                                    <div key={online.id} className="online-user-div">
                                                        <Link to={`/users/${online.id}/message`}>
                                                            <span>
                                                                <StyledBadge
                                                                    overlap="circular"
                                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                                    variant="dot"
                                                                >
                                                                    <Avatar alt="Remy Sharp" className='avt' src={online.photoUrl} />
                                                                </StyledBadge>
                                                            </span>
                                                            <span className="online-user-name text-lightProfileName dark:text-darkProfileName">{online.presenceName}</span>
                                                        </Link>
                                                    </div>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })
                                    ) : (
                                        <div>No users currently online.</div>
                                    )}
                                </div>
                            </>) : ''}

                            {activeTab === 'Request' ? (
                                <>
                                    <div className='message-tab-container' >
                                        {friendRequests.length === 0 ? (
                                            <div style={{ textAlign: "center" }} className='num-requ' >You have no request</div>
                                        ) : (
                                            friendRequests.map((item) => {
                                                if (item.receiverUid === currentUser.uid && item.status !== 'accepted') {
                                                    return (
                                                        <div key={item.id}>
                                                            <div className="request-container">
                                                                <div>
                                                                    <img src={item.senderPhotoUrl} className='request-img' alt="" />
                                                                </div>

                                                                <div className='request-inne-container'>
                                                                    <div className='request-name text-lightProfileName dark:text-darkProfileName'>{item.senderName}</div>

                                                                    <div className="request-btn-div d-flex">
                                                                        <div className="btn-success-custom box-shadow-none"
                                                                            onClick={() => acceptFriendRequest
                                                                                (item.id, item.senderId, item.receiverUid, item.senderName, item.senderPhotoUrl,
                                                                                    item.receiverName, item.receiverPhotoUrl, item.mainid)}>Accept</div>
                                                                        <div className="btn-D-custom box-shadow-none ms-4"
                                                                            onClick={() => DeleteRequest(item.id, item.senderId, item.receiverUid)}
                                                                        >Remove</div>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })
                                        )}
                                    </div>
                                </>
                            ) : ''}

                        </div >
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message

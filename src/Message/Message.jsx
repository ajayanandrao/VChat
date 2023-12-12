import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Message.scss";
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../Firebase';
import { styled, keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';
import { AuthContext } from './../AuthContaxt';
import { Avatar } from '@mui/material';


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
        const colRef = collection(db, 'OnlyOnline');

        const orderedQuery = query(
            collection(db, 'OnlyOnline'),
            orderBy('presenceTime', 'desc') // Reverse the order to show newest messages first
        );

        const unsubscribe = onSnapshot(orderedQuery, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setOnlineUsers(newApi);
        });

        return unsubscribe;
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
                // console.log('Notification deleted.');
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
                // console.log('Friend request accepted!');

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
                        // console.log('Notification deleted.');
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

        const smsRef = doc(db, `allFriends/${id}/Message/${currentUser.uid}`); // Include the document ID here
        const smsRefReciver = doc(db, `allFriends/${currentUser.uid}/Message/${id}`); // Include the document ID here

        updateDoc(smsRef, {
            status: "seen",
        })
        updateDoc(smsRefReciver, {
            photo: "seen",
        })
            .then(() => {
                // console.log("Message marked as seen successfully.");
            })
            .catch((error) => {
                console.error("Error marking message as seen:", error);
            });
    };


    function PostTimeAgoComponent({ timestamp }) {
        const postDate = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - postDate) / 1000);

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

            if (days > 10) {
                const options = { day: 'numeric', month: 'short', year: 'numeric' };
                return postDate.toLocaleDateString(undefined, options);
            } else {
                return `${days}d ago`;
            }
        }
    }

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await updateDoc(PresenceRefOnline, {
                    status: 'Offline',
                    presenceTime: new Date(),
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

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
                                                <Link to={`/users/${sms.userId}/message`} className='link' onClick={() => HandleSmsSeen(sms.id)}>
                                                    <div className='sms-div'>
                                                        <div className=" sms-user-ring-div">
                                                            <img src={sms.photoUrl} className='sms-user-img' alt="" />
                                                        </div>
                                                        <div className='sms-name' >{sms.name}</div>
                                                        <div style={{fontSize:"12px"}}>
                                                            <PostTimeAgoComponent timestamp={sms.time && sms.time.toDate()} />
                                                        </div>
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
                                                        {online && online.status === "Online" ? (
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
                                                        )
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })
                                    ) : (
                                        <div style={{ color: "white", textAlign: "center", fontSize: "24px" }}>No users currently online.</div>
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

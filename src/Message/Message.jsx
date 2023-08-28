import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Message.scss";
// import "./../Styles/flickity.scss";
import { Link, useNavigate } from 'react-router-dom';
// import Flickity from 'react-flickity-component';
import natur from "./nature.json";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { styled, keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';
import { AuthContext } from './../AuthContaxt';
import { Avatar } from '@mui/material';


const Message = () => {
    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    const [search, setSearch] = useState("");
    const colRef = collection(db, 'users');

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

    // const flickityOptions = {
    //     initialIndex: 1,
    //     accessibility: true,
    //     wrapAround: true,
    // }

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


    const DeleteRequest = async (id) => {
        const RequestRef = doc(db, 'NewFriendRequests', id);
        await deleteDoc(RequestRef);
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
                    orderBy('time', 'asc')
                );

                const unsubscribe = onSnapshot(friendsQuery, (friendsSnapshot) => {
                    const friendsData = friendsSnapshot.docs.map((doc) => doc.data());
                    setMessages(friendsData);
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



    return (
        <>
            <div className="message-wrapper">
                <div className="message-wrapper-inner">
                    <div className="wrapper-container">
                        <div className="Message-back-div">
                            <i onClick={goBack} className="bi bi-arrow-left "></i>
                            <input type="text" className='Message-User-input'
                                onChange={(e) => setSearch(e.target.value)}
                                value={search} placeholder='Message-User' />
                        </div>

                        <div className="Message-user-List">

                            <div className="tab-block">
                                <button className="w3-bar-item w3-button" onClick={() => openCity('Message')}>
                                    Message
                                </button>

                                <button className="w3-bar-item w3-button" onClick={() => openCity('Online')}>
                                    Online
                                </button>


                                <div className='request-tab-relative-div'>
                                    <button className="w3-bar-item w3-button" onClick={() => openCity('Request')}>

                                        <div className='request-tab-absolute-div'>
                                            {friendRequests.map((item) => {
                                                if (item.receiverUid == currentUser.uid) {
                                                    return (
                                                        <>
                                                            <div className="request-animated-circle">
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            })}
                                        </div>
                                        Request

                                    </button >
                                </div>

                            </div >

                            <div id="Message" className=" w3-animate-left city">

                                {api.map((item) => {
                                    return (
                                        <>
                                            {uniqueUserIds.map((userId) => {
                                                const userMessages = messages.filter((message) => message.userId === userId);
                                                const user = userMessages[0]; // Assuming the first message represents the user's details
                                                if (item.uid === user.userId) {
                                                    return (
                                                        <div key={userId}>
                                                            <div className='message-profile-div-one'>
                                                                <Link style={{ textDecoration: "none" }} to={`/users/${user.userId}/message`}>
                                                                    <img src={item.PhotoUrl} className='message-user-img' alt='' />
                                                                    <span className='message-user-name'>{item.name}</span>
                                                                </Link>
                                                            </div>
                                                            {userMessages.map((message, index) => (
                                                                <div key={index}>{message.messageContent}</div>
                                                            ))}
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </>
                                    )
                                })}




                            </div>

                            <div id="Online" className=" w3-animate-bottom city" style={{ display: "none" }}>

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
                                                        <span className="online-user-name">{online.presenceName}</span>
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



                            <div id="Request" className=" w3-animate-right city" style={{ display: "none" }}>

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
                                                            <div className='request-name'>{item.senderName}</div>

                                                            <div className="request-btn-div d-flex">
                                                                <div className="btn-success-custom"
                                                                    onClick={() => acceptFriendRequest
                                                                        (item.id, item.senderId, item.receiverUid, item.senderName, item.senderPhotoUrl,
                                                                            item.receiverName, item.receiverPhotoUrl, item.mainid)}>Accept</div>
                                                                <div className="btn-D-custom ms-4"
                                                                    onClick={() => DeleteRequest(item.id)}
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

                        </div >
                    </div>
                </div>
            </div>
        </>
    )
}

export default Message

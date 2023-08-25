import React, { useContext, useEffect, useState } from 'react'
import "./People.scss";
import { MdDarkMode } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';
import { db } from "../Firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from "./../AuthContaxt";
import { v4 } from 'uuid';

const People = ({ userP }) => {

    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [api, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const colRef = collection(db, "users");
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setLoading(false); // Mark loading as false once data is fetched
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    // add friend

    const [friendRequests, setFriendRequests] = useState([]);
    const [addedUsers, setAddedUsers] = useState(false);


    const handleAddFriend = (id) => {

        setAddedUsers(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        console.log(id)
    };


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

            // Retrieve the unique ID and update the document with it
            await updateDoc(newFriendRequestDocRef, { mainid: newFriendRequestDocRef.id });

            // document.getElementById(`add-${id}`).style.display = 'none';
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

            querySnapshot.forEach((doc) => {
                const request = doc.data();
                if (request.senderId === senderId && request.receiverUid === otherUserId && request.status === 'pending') {
                    deleteDoc(doc.ref);
                    console.log('Friend request canceled.');
                }
            });
        } catch (error) {
            console.error('Error canceling friend request:', error);
        }
    };

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

    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        const friendsRef = collection(db, `allFriends/${currentUser.uid}/Friends`);
        const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
            const newFriendsList = snapshot.docs.map((doc) => doc.data());
            setFriendsList(newFriendsList);
        });

        return unsubscribe;
    }, []);

    const isFriend = (userId) => {
        return friendsList.some((friend) => friend.userId === userId);
    };

    return (
        <>
            <div className="people-wrapper">
                <div className="people-wrapper-inner">
                    <div className="People-back-div">
                        <i onClick={goBack} className="bi bi-arrow-left "></i>
                        <input type="text"
                            className='People-User-input'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Search friends' />
                    </div>

                    <div className="People-user-List">
                        {api
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

                                    return (
                                        <div key={item.id}>
                                            <div className="people-container">
                                                <Link to={`/users/${item.uid}`}>
                                                    <div>
                                                        <img src={item.PhotoUrl} className="people-img" alt="" />
                                                    </div>
                                                </Link>
                                                <div className="people-name-div">
                                                    <div className="people-name">{item.name}</div>
                                                    <div className="people-btn-div">
                                                        {friendRequest ? (
                                                            <div
                                                                id={`cancel-${item.id}`}
                                                                className="btn-dengar-custom ms-2"
                                                                onClick={() =>
                                                                    cancelFriendRequest(
                                                                        item.id,
                                                                        currentUser.uid,
                                                                        item.uid
                                                                    )
                                                                }
                                                            >
                                                                Cancel Request
                                                            </div>
                                                        ) : isFriendRequestAccepted ? (
                                                            <div className="friend-request-accepted">Friend Request Accepted</div>
                                                        ) : isFriend(item.uid) ? (
                                                            <div className="friend-request-accepted">Friend</div>
                                                        ) : (
                                                            <div
                                                                id={`add-${item.id}`}
                                                                className="btn-primary-custom"
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
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>

                    <div className="People-user-bottom">

                    </div>
                </div>
            </div>
        </>
    )
}

export default People



// {loading ? <>loading.......</> :
//                         <div className="People-user-List">
//                             {api
//                                 .filter((value) => {
//                                     if (search === "") {
//                                         return value;
//                                     } else if (value.name.toLowerCase().includes(search.toLowerCase())) {
//                                         return value;
//                                     }
//                                 })
//                                 .map((item) => {
//                                     if (item.uid !== currentUser.uid) {
//                                         const friendRequest = check.find(
//                                             (request) =>
//                                                 request.senderId === currentUser.uid &&
//                                                 request.receiverUid === item.uid &&
//                                                 request.status === 'pending'
//                                         );

//                                         const isFriendRequestAccepted = friendsList.some(
//                                             (friend) => friend.userId === item.uid && friend.status === 'accepted'
//                                         );

//                                         if (!friendRequest && isFriendRequestAccepted) {
//                                             // Skip rendering if there is no friend request and it is already accepted
//                                             return null;
//                                         }

//                                         return (
//                                             <div key={item.id}>
//                                                 <div className="people-container">
//                                                     <Link to={`/users/${item.uid}`}>
//                                                         <div>
//                                                             <img src={item.PhotoUrl} className="people-img" alt="" />
//                                                         </div>
//                                                     </Link>
//                                                     <div className="people-name-div">
//                                                         <div className="people-name">{item.name}</div>
//                                                         <div className="people-btn-div">
//                                                             {friendRequest ? (
//                                                                 <div
//                                                                     id={`cancel-${item.id}`}
//                                                                     className="btn-dengar-custom ms-2"
//                                                                     onClick={() =>
//                                                                         cancelFriendRequest(item.id, currentUser.uid, item.uid)
//                                                                     }
//                                                                 >
//                                                                     Cancel Request
//                                                                 </div>
//                                                             ) : isFriend(item.uid) ? (
//                                                                 <div className="friend-request-accepted">Friend</div>
//                                                             ) : (
//                                                                 <div
//                                                                     id={`add-${item.id}`}
//                                                                     className="btn-primary-custom"
//                                                                     onClick={() =>
//                                                                         sendFriendRequest(
//                                                                             item.id,
//                                                                             item.uid,
//                                                                             item.name,
//                                                                             item.PhotoUrl
//                                                                         )
//                                                                     }
//                                                                 >
//                                                                     Add a friend
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     }
//                                 })}
//                         </div>
//                     }


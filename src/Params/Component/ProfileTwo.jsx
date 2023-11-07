import React, { useContext, useEffect, useState } from 'react'
import "./ProfileTwo.scss";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { Link } from 'react-router-dom';

const ProfileTwo = ({ user }) => {
    const { currentUser } = useContext(AuthContext);
    const [dataFetched, setDataFetched] = useState(false);

    const sendFriendRequest = async (otherUserId, otherUserName, otherUserPhotoUrl) => {
        // console.log(user.uid)
        try {
            const newFriendRequestDocRef = await addDoc(collection(db, 'NewFriendRequests'), {
                senderId: currentUser.uid,
                senderName: currentUser.displayName,
                senderPhotoUrl: currentUser.photoURL,

                receiverPhotoUrl: user.userPhoto,
                receiverUid: user.uid,
                receiverName: user.name,
                status: 'pending',
                timestamp: serverTimestamp(),
            });
            // Retrieve the unique ID and update the document with it
            const newFriendRequestId = newFriendRequestDocRef.id;
            await updateDoc(newFriendRequestDocRef, { mainid: newFriendRequestId });


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

            // document.getElementById(`add-${id}`).style.display = 'none';
            // console.log('Friend request sent successfully!',);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);

        });

        return unsubscribe;
    }, []);


    const cancelFriendRequest = async (senderId, otherUserId, uid) => {

        // console.log("recipientId :-", otherUserId);
        // console.log("sender :-", senderId);

        try {
            const friendRequestsRef = collection(db, 'NewFriendRequests');
            const querySnapshot = await getDocs(friendRequestsRef);

            querySnapshot.forEach(async (doc) => {
                const request = doc.data();
                if (request.senderId === currentUser.uid && request.receiverUid === user.uid && request.status === 'pending') {
                    deleteDoc(doc.ref);
                    // console.log('Friend request canceled.');
                    // console.log('Friend request canceled.');

                    const notificationRef = collection(db, 'Notification');
                    const notificationQuerySnapshot = await getDocs(notificationRef);
                    notificationQuerySnapshot.forEach(async (notificationDoc) => {
                        const notificationData = notificationDoc.data();
                        if (notificationData.senderId === currentUser.uid && notificationData.postSenderUid === senderId && (notificationData.status === 'pending' || notificationData.status === 'accepted')) {
                            await deleteDoc(notificationDoc.ref);
                            // console.log('Notification deleted.');
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error canceling friend request:', error);
        }
    };


    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        const friendsRef = collection(db, `allFriends/${user.uid}/Friends`);
        const unsubscribe = onSnapshot(friendsRef, (snapshot) => {
            const newFriendsList = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id  // Add the document ID to the friend's data
            }));
            setFriendsList(newFriendsList);
            setDataFetched(true);

        });

        return unsubscribe;
    }, []);

    // { friendsList.map((item) => console.log(item.uid)) }

    const [friendUserId, setFriendUserId] = useState(null);
    const isFriend = (userId) => {
        // console.log(userId); // dont want that id this is Nikita's
        return friendsList.some((friend) => friend.userId === userId); //this is a kiran id
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




    return (
        <>

            <div className="profile-name-container-main">
                <h3 className='profile-name-text text-2xl text-lightProfileName dark:text-darkProfileName'>{user.name}</h3>

                <div style={{ fontWeight: "600" }} className='text-lightPostText dark:text-darkPostText'> {friendsList.length} Friends</div>

                {api.map((item) => {
                    if (user.uid === item.uid) {
                        return (
                            <>
                                <div className="about-intro-div text-lightPostText dark:text-darkPostText">
                                    {item.intro}
                                </div>
                            </>
                        )
                    }
                })}

                <div className='profile-add-btn'>
                    {api.map((item) => {
                        if (item.uid === user.uid) {
                            const friendRequest = check.find(
                                (request) =>
                                    request.senderId === currentUser.uid &&
                                    request.receiverUid === user.uid &&
                                    request.status === 'pending'
                            );

                            const isFriendRequestAccepted = friendsList.find((friend) => {
                                // console.log(friend.displayName + " :- " + friend.userId);
                                // console.log("currentUser :- " + currentUser.uid);

                                return friend.userId === currentUser.uid && friend.status === 'accepted';
                            });


                            return (
                                <div key={item.id}>
                                    <div className="people-container">
                                        <div className="people-name-div">
                                            <div className="people-btn-div">
                                                {friendRequest ? (
                                                    <div
                                                        id={`cancel-${item.id}`}
                                                        className="btn-dengar-custom ms-2"
                                                        onClick={() =>
                                                            cancelFriendRequest(
                                                                item.uid,
                                                                currentUser.uid,
                                                                item.uid
                                                            )
                                                        }
                                                    >
                                                        Cancel Request
                                                    </div>
                                                ) : isFriendRequestAccepted ? (
                                                    <Link to={`/users/${item.uid}/message`}>
                                                        <button className='btn btn-info btn-sm'>Message</button>
                                                    </Link>
                                                    // <div className="friend-request-accepted">Friend Request Accepted</div>
                                                ) : isFriend(item.uid) ? (
                                                    // <div className="friend-request-accepted">Friend</div>
                                                    <Link to={`/users/${item.uid}/message`}>
                                                        <button className='btn btn-info btn-sm'>Message</button>
                                                    </Link>
                                                ) : dataFetched ? (
                                                    <div
                                                        id={`add-${item.id}`}
                                                        className="btn-primary-custom"
                                                        onClick={() =>
                                                            sendFriendRequest(
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
                    })}

                </div>
            </div>
        </>
    )
}

export default ProfileTwo

import React, { useContext, useEffect, useState } from 'react'
import "./ProfileTwo.scss";
import { addDoc, collection, deleteDoc, getDocs, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';

const ProfileTwo = ({ user }) => {
    const { currentUser } = useContext(AuthContext);

    const sendFriendRequest = async (otherUserId, otherUserName, otherUserPhotoUrl) => {
        console.log(user.uid)
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
            await updateDoc(newFriendRequestDocRef, { mainid: newFriendRequestDocRef.id });

            // document.getElementById(`add-${id}`).style.display = 'none';
            console.log('Friend request sent successfully!',);
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


    const cancelFriendRequest = async ( senderId, otherUserId) => {

        console.log("recipientId :-", otherUserId);
        console.log("sender :-", senderId);

        try {
            const friendRequestsRef = collection(db, 'NewFriendRequests');
            const querySnapshot = await getDocs(friendRequestsRef);

            querySnapshot.forEach((doc) => {
                const request = doc.data();
                if (request.senderId === currentUser.uid && request.receiverUid === user.uid && request.status === 'pending') {
                    deleteDoc(doc.ref);
                    console.log('Friend request canceled.');
                }
            });
        } catch (error) {
            console.error('Error canceling friend request:', error);
        }
    };


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
                <h3 className='profile-name-text'>{user.name}</h3>
                <div className='profile-add-btn'>
                    {api.map((item) => {
                        if (item.uid === currentUser.uid) {
                            const friendRequest = check.find(
                                (request) =>
                                    request.senderId === currentUser.uid &&
                                    request.receiverUid === user.uid &&
                                    request.status === 'pending'
                            );

                            const isFriendRequestAccepted = friendsList.some(
                                (friend) =>
                                    friend.userId === currentUser.uid &&
                                    friend.status === 'accepted'
                            );

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
                    <button className='btn btn-info btn-sm'>Message</button>
                </div>
            </div>
        </>
    )
}

export default ProfileTwo

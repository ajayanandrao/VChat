import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { Link } from 'react-router-dom';
import "./MessageFriendList.scss";

const MessageFriendList = () => {
    const { currentUser } = useContext(AuthContext);
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
        closeAllDropdowns();
        document.getElementById(`User${id}`).style.background = "#5858FA";
        document.getElementById(`UserName${id}`).style.color = "White";
        document.getElementById(`UserTime${id}`).style.color = "White";
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

    function closeAllDropdowns() {
        const UserListDiv = document.querySelectorAll('.message-friend-list-div');
        const UserListName = document.querySelectorAll('.message-friend-list-name');
        const UserListTime = document.querySelectorAll('.message-friend-list-time');

        UserListDiv.forEach(userList => {
            userList.style.background = '';
        });
        UserListName.forEach(userListName => {
            userListName.style.color = '';
        });
        UserListTime.forEach(userListTime => {
            userListTime.style.color = '';
        });

    }

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
    return (
        <div className='w-100'>
            {messages.map((sms) => {

                return (
                    <div key={sms.id}>
                        <Link to={`/users/${sms.userId}/message`} onClick={() => HandleSmsSeen(sms.id)} className='link'>
                            <div id={`User${sms.id}`} className='message-friend-list-div bg-light_0  text-lightProfileName dark:bg-dark text-[white]  dark:text-darkProfileName'>
                                <div>
                                    <img src={sms.photoUrl} className='message-friendList-img' alt="" />
                                </div>
                                <div className='message-friend-list-name' id={`UserName${sms.id}`}>{sms.name}</div>
                                <div className='message-friend-list-time text-[white] text-lightPostTime dark:text-darkPostTime' id={`UserTime${sms.id}`}>
                                    <PostTimeAgoComponent timestamp={sms.time && sms.time.toDate()} />
                                </div>
                            </div>
                        </Link>
                    </div>
                );

            })}
            <div style={{ height: "15px" }}></div>
        </div>
    )
}

export default MessageFriendList
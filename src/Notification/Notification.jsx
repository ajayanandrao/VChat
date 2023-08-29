import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Notification.scss";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import ReactTimeago from 'react-timeago';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContaxt';


const Notification = ({ post, postLike }) => {
    const { currentUser } = useContext(AuthContext);

    const likeList = () => {
        return (
            <>
                {/* {postLike.name} */}
            </>
        )
    };

    const [isLiked, setIsliked] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'Notification'),
                orderBy('time', "desc")
            ),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
        );

        return unsubscribe;
    }, [post.id]);


    const [isComment, setIsComment] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'Notification'),
                orderBy('time', "desc")
            ),
            (snapshot) => {
                setIsComment(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
        );

        return unsubscribe;
    }, [post.id]);

    const videoRef = useRef(null);
    const [postId, setPostId] = useState("");

    const ViewLikedPost = (id) => {
        setPostId(id);
    };

    // function TimeAgoComponent({ timestamp }) {
    //     return <ReactTimeago date={timestamp} />;
    // }

    function TimeAgoComponent({ timestamp }) {
        const now = new Date().getTime();
        const timeDifference = now - timestamp;
        const seconds = Math.floor(timeDifference / 1000);

        let timeAgo = '';

        if (seconds < 60) {
            timeAgo = `${seconds}s ago`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            timeAgo = `${minutes}m ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            timeAgo = `${hours}h ago`;
        } else {
            const days = Math.floor(seconds / 86400);
            timeAgo = `${days}d ago`;
        }

        return <span>{timeAgo}</span>;
    }


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

    const DeleteRequest = async (id) => {
        const RequestRef = doc(db, 'NewFriendRequests', id);
        await deleteDoc(RequestRef);
    };

    return (
        <>
            <div className="notification">
                <div>

                    {isLiked.map((item) => {
                        return (
                            <Link to={`/notification/${post.id}`}>
                                <div style={{
                                    marginBottom: "30px",
                                    position: "relative"
                                }} key={item.com}>

                                    <div className='notification-profile-div'>
                                        <div>
                                            <img src={item.photoUrl} className='notificatioin-profile-img ' alt="" />
                                        </div>
                                        <span className='notification-profile-name'> {item.name}</span>
                                        <TimeAgoComponent timestamp={item.time && item.time.toDate()} />
                                    </div>

                                    <div className='noti-wrapper'>
                                        <div className='text-div'>
                                            {item.like ? <>
                                                <span className='noti-text' sty> <strong> {item.like} </strong></span>
                                                <span className='ms-2'>your post </span></> : ""}
                                        </div>

                                        <div className='text-div'>
                                            {item.com ? <>
                                                <span className='noti-text'><strong> {item.com} </strong></span>
                                                <span className='ms-2'> your post</span></> : ""}
                                        </div>

                                        <div className='noti-post-img-div'>

                                            {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                                                <img src={post.photoURL} alt="Uploaded" className="notification-post-img" />
                                            ) : post.img ? (

                                                <div className="video-container">
                                                    <video ref={videoRef} className="notification-post-img" >
                                                        <source src={post.img} type="video/mp4" />
                                                    </video>

                                                </div>


                                            ) : null}

                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}

                    {/* Request ------------------------------------ */}

                    {/* {friendRequests.map((request) => {
                        if (request.receiverUid === currentUser.uid) {
                            return (
                                <>
                                    <div className='request-notifiacation-profile-div'>
                                        <img src={request.senderPhotoUrl} className='request-notification-image' alt="" />
                                        <div className="request-notification-inner-div">
                                            <div className='request-notifiaction-name'>{request.senderName}</div>
                                            <div className='d-flex'>
                                                <div className="btn-success-custom"
                                                    onClick={() => acceptFriendRequest
                                                        (request.id, request.senderId, request.receiverUid, request.senderName, request.senderPhotoUrl,
                                                            request.receiverName, request.receiverPhotoUrl, request.mainid)}>Accept</div>

                                                <div className="btn-D-custom ms-4"
                                                    onClick={() => DeleteRequest(request.id)}
                                                >Remove</div>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )
                        }
                    })} */}


                </div>
            </div>
        </>
    )
}

export default Notification

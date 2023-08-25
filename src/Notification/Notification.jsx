import React, { useEffect, useRef, useState } from 'react'
import "./Notification.scss";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import ReactTimeago from 'react-timeago';
import { Link } from 'react-router-dom';


const Notification = ({ post, postLike }) => {

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
                                            {item.lik ? <>
                                                <span className='noti-text' sty> <strong> {item.lik} </strong></span>
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


                </div>
            </div>
        </>
    )
}

export default Notification

import React, { useContext, useEffect, useRef, useState } from 'react'
import "./UserPhoto.scss";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { FiMaximize } from "react-icons/fi"
import { MdDelete } from "react-icons/md"
import { IoMdClose } from "react-icons/io"
import { useNavigate } from 'react-router-dom';

const UserPhoto = () => {

    const { currentUser } = useContext(AuthContext);
    const [userPhoto, setUserPhoto] = useState([]);
    const [photoTime, setPhotoTime] = useState("");

    useEffect(() => {
        const colRef = collection(db, 'UserPostPhoto');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setUserPhoto(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const isImage = (filename) => {
        const imageExtensions = ['jpg', 'jpeg', 'png'];
        const extension = getFileExtension(filename);
        return imageExtensions.includes(extension);
    };

    const ViewPhoto = (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
    }
    const closeViewPhoto = (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
    };
    const deletePhoto = async (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
        const colRef = doc(db, 'UserPostPhoto', id);
        await deleteDoc(colRef);

    };


    const formatTimestamp = (timestamp) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(timestamp.toDate());
    };


    const newData = userPhoto.map((post) => {
        if (post.uid === currentUser.uid) {

            return (
                <div key={post.id}>

                    <div id={`ViewImg${post.id}`} style={{ display: "none" }}
                        className='ViewImg' >

                        <div className="viewImg-relative">

                            <div className="viewimg-option">

                                <div className='viewimg-option-inner-div'>
                                    <div className='viewimg-option-delete'>

                                        <div className="photo-time">{formatTimestamp(post.bytime)}</div>
                                        <MdDelete style={{ fontSize: "26px" }} onClick={() => deletePhoto(post.id)} />
                                    </div>
                                    <div className='viewimg-option-close'>
                                        <IoMdClose style={{ fontSize: "26px", color: "black" }} onClick={() => closeViewPhoto(post.id)} />
                                    </div>


                                </div>
                            </div>

                            <div className='viewimg-div'>
                                <img src={post.img} className='viewimg' alt="" />
                            </div>
                        </div>
                    </div>

                    {post.img && isImage(post.name) &&
                        (
                            <div key={post.id} onClick={() => { ViewPhoto(post.id) }}
                                className='photo-card'
                                style={{ backgroundImage: `url(${post.img})` }}>

                            </div >
                        )
                    }
                </div>
            );
        }
    });

    const isVideo = (filename) => {
        const videoExtensions = ['mp4'];
        const extension = getFileExtension(filename);
        return videoExtensions.includes(extension);
    };


    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef([]);
    const handleVideoBtnClick = (id) => {
        const video = videoRef.current[id];
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };


    const VideoData = userPhoto.map((post) => {
        if (post.uid === currentUser.uid) {
            return (
                <>
                    {post.img && isVideo(post.name) && (
                        <>
                            <div className='video-container'>
                                <video className='UserVideo' ref={(el) => (videoRef.current[post.id] = el)}
                                    onClick={() => handleVideoBtnClick(post.id)}  >
                                    <source src={post.img} type="video/mp4" />
                                </video>
                            </div>
                        </>
                    )
                    }
                </>
            )
        }
    });


    return (
        <>



            <div class="grid-parent-container">
                <div className="grid-container" >
                    {newData}
                </div>
            </div>

            <h3 className='video-text'>Video</h3>

            {VideoData}
        </>

    )
}


export default UserPhoto
{/* <div className='photo-card' style={{ backgroundImage: `url(${ post.img })` }}></div> */ }
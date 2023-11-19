import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../../AuthContaxt';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { MdDelete } from 'react-icons/md';
import { FiMaximize } from 'react-icons/fi';
import "./ProfilePhotos.scss";

const ProfilePhotos = ({ user }) => {

    const { currentUser } = useContext(AuthContext);

    const [userPhoto, setUserPhoto] = useState([]);

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


    const closeViewPhoto = (id) => {
        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }
    };

    const ViewPhotoDiv = (id) => {

        const x = document.getElementById(`ViewImg${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        } else {
            x.style.display = 'none';
        }

    }

    const newData = userPhoto.map((post) => {
        if (post.uid === user.uid) {

            return (
                <div key={post.id}>

                    <div id={`ViewImg${post.id}`} style={{ display: "none" }} className='ViewImg' onClick={() => closeViewPhoto(post.id)}>
                        <div className="ViewImg-center">
                            <img src={post.img} className='View-Img' alt="" />
                        </div>
                    </div>
                    {post.img && isImage(post.name) &&
                        (
                            <div className='photo-card' onClick={() => ViewPhotoDiv(post.id)} style={{ backgroundImage: `url(${post.img})` }}>

                            </div>
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
        if (post.uid === user.uid) {
            return (
                <div key={post.id}>
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
                </div>
            )
        }
    });


    return (
        <>
            <div class="photo-grid-parent-container">
                <div className="grid-container" >
                    {newData}
                </div>
            </div>

            <h3 className='video-text video-text text-2xl text-lightPostText dark:text-darkPostText'>Video</h3>

            {VideoData}
        </>
    )
}

export default ProfilePhotos

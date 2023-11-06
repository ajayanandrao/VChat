import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../AuthContaxt';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import "./RealWork.scss";
import { useNavigate } from 'react-router-dom';

const RealWork = () => {
    const [api, setApiData] = useState([]);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }
    const { currentUser } = useContext(AuthContext);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setApiData(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className='realWork-main-container dark:bg-dark bg-light_0 dark:text-darkProfileName text-lightProfileName'>
            <div className="left"></div>

            <div id="Reel-Video-Container" >

                {api.map((video, index) => (
                    <div key={index} >
                        <div className="Reel-Video-Div">
                            <video className="Reel-Video-Div">
                                <source src={video.img} type="video/mp4" />
                            </video>
                            <div className="Reel-back-div">
                                <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostIcon"></i>
                            </div>
                            <div className="reel-profile-div">
                                <img src={video.photoURL} className='reel-profile-photo' alt="" />
                            </div>
                            <div className='name'>{video.displayName}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default RealWork
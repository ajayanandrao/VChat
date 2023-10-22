import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../AuthContaxt';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import "./RealWork.scss";

const RealWork = () => {
    const [api, setApiData] = useState([]);
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

    const videoContainerRef = useRef(null);
    const videoHeight = 200; // Height of each video (adjust to your video's actual height)

    const handleScroll = () => {
        const container = videoContainerRef.current;
        const scrollTop = container.scrollTop;
        const videoIndex = Math.floor(scrollTop / videoHeight);
        const targetScrollTop = videoIndex * videoHeight;
        container.scrollTop = targetScrollTop;
    };

    const containerStyles = {
        overflowY: 'auto',
        maxHeight: '600px',
    };

    const videoStyles = {
        height: `${videoHeight}px`,
    };

    return (
        <div className='realWork-main-container dark:bg-dark bg-light_0 dark:text-darkProfileName text-lightProfileName'>
            <div className="left"></div>

            <div className="Reel-main-div">

                <div className="Reel-div" style={containerStyles} onScroll={handleScroll} ref={videoContainerRef}>
                    {api.map((video, index) => (
                        <div key={index} className="Reel-video" style={videoStyles}>
                            <video autoPlay loop muted>
                                <source src={video.img} type="video/mp4" />
                            </video>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RealWork
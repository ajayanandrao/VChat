import React, { useContext, useEffect, useState } from 'react'
import "./UserProfileThree.scss";
import { AuthContext } from "./../../AuthContaxt";
import UserPost from '../Tab/UserPost';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import UserPhoto from '../Tab/UserPhoto';
import Friends from '../Tab/Friends ';
import { CircularProgress, LinearProgress } from '@mui/material';
import About from '../Tab/About';
import UserMedia from '../Tab/UserMedia';

const ProfileThree = ({ user }) => {
    const { currentUser } = useContext(AuthContext);


    function openCity(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    const [api, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setApiData(fetchedPosts);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);


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
    const currentuser = {
        uid: 'currentUserId',
        // Other currentUser properties
    };



    return (
        <>
            <div className="profileThree-container">

                <div className="tab">
                    <button className="tablinks active" onClick={(event) => openCity(event, 'Post')}> <div className='text-lightPostText dark:text-darkPostText'> Post</div></button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'About')}> <div className='text-lightPostText dark:text-darkPostText'> About </div></button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Friend')}> <div className='text-lightPostText dark:text-darkPostText'> Friend </div></button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Photo')}> <div className='text-lightPostText dark:text-darkPostText'> Photos </div></button>
                </div>

                <div className='content-div'>

                    <div id="Post" className="tabcontent w3-animate-opacity" style={{ display: "block" }}>
                        {loading ?
                            <>
                                <div className='skeleton-center bg-light_0 dark:bg-dark'>
                                    <CircularProgress className='circularprogress' />
                                </div>
                            </>

                            : ""}
                        {
                            api.map((item) => {
                                if (currentUser && currentUser.uid === item.uid) {
                                    return (
                                        <div key={item.id}>
                                            <UserPost post={item} />
                                        </div>
                                    );
                                }
                                return null;
                            })
                        }

                    </div>

                    <div id="About" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        <About />
                    </div>

                    <div id="Friend" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        {/* <Friends /> */}
                        <Friends currentuser={currentuser} />
                    </div>

                    <div id="Photo" style={{ display: "none" }} className="tabcontent w3-animate-opacity">

                        {/* <UserPhoto /> */}
                        <UserMedia />
                    </div>
                </div>
            </div >
        </>
    )
}

export default ProfileThree

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


    const [api, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedPosts = snapshot.docs.map((doc) => {
                    const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                    return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
                });

                setApiData(fetchedPosts);
                setLoading(false);
            });

            return () => {
                // Cleanup the subscription when the component unmounts
                unsubscribe();
            };
        }, 1000);

        return () => clearTimeout(delay);
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


    const [activeTab, setActiveTab] = useState('Post');
    const setActive = (tabName) => {
        setActiveTab(tabName);
    };

    const currentUserApi = api.filter(item => item.uid === currentUser.uid);

    return (
        <>

            <div className="profileThree-container">

                <div className="tablink-btn-wrapper">
                    <div className="tablink-btn-inner-wrapper">
                        <div className={`tablinks text-lightProfileName dark:text-darkPostText ${activeTab === 'Post' ? 'active' : ''}`} onClick={() => setActive('Post')}> Post</div>
                        <div className={`tablinks text-lightProfileName dark:text-darkPostText ${activeTab === 'About' ? 'active' : ''}`} onClick={() => setActive('About')}>About</div>
                        <div className={`tablinks text-lightProfileName dark:text-darkPostText ${activeTab === 'Friend' ? 'active' : ''}`} onClick={() => setActive('Friend')}>Friend</div>
                        <div className={`tablinks text-lightProfileName dark:text-darkPostText ${activeTab === 'Photo' ? 'active' : ''}`} onClick={() => setActive('Photo')}>Photos</div>
                    </div>
                </div>


                <div className='content-div'>

                    <div id="Post" className="" style={{ display: "block" }}>

                        {activeTab === 'Post' ? (<>
                            <div className='text-lightProfileName dark:text-darkProfileName'>

                                {loading ?
                                    <>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div className='cla'>
                                                <div className='placeholder-glow'>
                                                    <div className="placeholder userProfilePost-loading-div bg-lightPostIcon dark:bg-darkPostIcon">
                                                        <div className='userProfilePost-loading-wrapper'>
                                                            <div className="userProfilePost-loading-div bg-lightPostIcon dark:bg-darkDiv"></div>

                                                            <div>
                                                                <div className="userProfilePost-loading-name bg-lightPostIcon dark:bg-darkDiv"></div>
                                                                <div className="userProfilePost-loading-name-two bg-lightPostIcon dark:bg-darkDiv"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='cla'>
                                                <div className='placeholder-glow'>
                                                    <div className="placeholder userProfilePost-loading-div bg-lightPostIcon dark:bg-darkPostIcon">
                                                        <div className='userProfilePost-loading-wrapper'>
                                                            <div className="userProfilePost-loading-div bg-lightPostIcon dark:bg-darkDiv"></div>

                                                            <div>
                                                                <div className="userProfilePost-loading-name bg-lightPostIcon dark:bg-darkDiv"></div>
                                                                <div className="userProfilePost-loading-name-two bg-lightPostIcon dark:bg-darkDiv"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cla'>
                                                <div className='placeholder-glow'>
                                                    <div className="placeholder userProfilePost-loading-div bg-lightPostIcon dark:bg-darkPostIcon">
                                                        <div className='userProfilePost-loading-wrapper'>
                                                            <div className="userProfilePost-loading-div bg-lightPostIcon dark:bg-darkDiv"></div>

                                                            <div>
                                                                <div className="userProfilePost-loading-name bg-lightPostIcon dark:bg-darkDiv"></div>
                                                                <div className="userProfilePost-loading-name-two bg-lightPostIcon dark:bg-darkDiv"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cla'>
                                                <div className='placeholder-glow'>
                                                    <div className="placeholder userProfilePost-loading-div bg-lightPostIcon dark:bg-darkPostIcon">
                                                        <div className='userProfilePost-loading-wrapper'>
                                                            <div className="userProfilePost-loading-div bg-lightPostIcon dark:bg-darkDiv"></div>

                                                            <div>
                                                                <div className="userProfilePost-loading-name bg-lightPostIcon dark:bg-darkDiv"></div>
                                                                <div className="userProfilePost-loading-name-two bg-lightPostIcon dark:bg-darkDiv"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cla'>
                                                <div className='placeholder-glow'>
                                                    <div className="placeholder userProfilePost-loading-div bg-lightPostIcon dark:bg-darkPostIcon">
                                                        <div className='userProfilePost-loading-wrapper'>
                                                            <div className="userProfilePost-loading-div bg-lightPostIcon dark:bg-darkDiv"></div>

                                                            <div>
                                                                <div className="userProfilePost-loading-name bg-lightPostIcon dark:bg-darkDiv"></div>
                                                                <div className="userProfilePost-loading-name-two bg-lightPostIcon dark:bg-darkDiv"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cla'>
                                                <div className='placeholder-glow'>
                                                    <div className="placeholder userProfilePost-loading-div bg-lightPostIcon dark:bg-darkPostIcon">
                                                        <div className='userProfilePost-loading-wrapper'>
                                                            <div className="userProfilePost-loading-div bg-lightPostIcon dark:bg-darkDiv"></div>

                                                            <div>
                                                                <div className="userProfilePost-loading-name bg-lightPostIcon dark:bg-darkDiv"></div>
                                                                <div className="userProfilePost-loading-name-two bg-lightPostIcon dark:bg-darkDiv"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </>

                                    : ""}
                                {currentUserApi.length < 1 ? <div style={{ textAlign: "center" }} className='no-post-div text-2xl'>You have no posts</div> : ""}

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
                        </>) : ''}
                    </div>

                    {activeTab === 'About' ? (<>
                        <div>
                            <About />
                        </div>
                    </>) : ''}



                    {activeTab === 'Friend' ? (
                        <>
                            <div >
                                <Friends currentuser={currentuser} />
                            </div>
                        </>
                    ) : ''}



                    {activeTab === 'Photo' ? (<>
                        <div >
                            <UserMedia />
                        </div>

                    </>) : ''}


                </div>
            </div >
        </>
    )
}

export default ProfileThree

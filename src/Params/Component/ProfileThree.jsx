import React, { useContext, useEffect, useState } from 'react'
import "./ProfileThree.scss";
import UserPhoto from '../ParamsTab/UserPhoto';
import UserPostPage from "./../ParamsTab/UserPostPage";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import UserFriendPage from '../ParamsTab/UserFriendPage';
import UserAboutPage from '../ParamsTab/UserAboutPage';
import UserMedia from '../ParamsTab/UserMedia';
import { CircularProgress, LinearProgress } from '@mui/material';
import { AuthContext } from '../../AuthContaxt';

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
    const [loading, setLoading] = useState(true);
    const [api, setApiData] = useState([]);

    const colRef = collection(db, 'AllPosts');
    const q = query(colRef, orderBy('bytime', 'desc'));
    useEffect(() => {
        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setApiData(newApi);
                setLoading(false);
            });

            return () => {
                // Cleanup the subscription when the component unmounts
                unsubscribe();
            };
        }, 1000);

        return () => clearTimeout(delay);
    }, []);


    const [activeTab, setActiveTab] = useState('Post');
    const setActive = (tabName) => {
        setActiveTab(tabName);
    };

    const currentUserApi = api.filter(item => item.uid === user.uid);

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

                <div className='content-div text-lightProfileName dark:text-darkProfileName'>

                    <div id="Post" className="tabcontent w3-animate-opacity" style={{ display: "block" }}>


                        {activeTab === 'Post' ? (<>
                            <div>
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

                                {currentUserApi.length < 1 ? <div style={{ textAlign: "center" }} className='no-post-div text-4xl'>No posts</div> : ""}

                                {
                                    api.map((item) => {
                                        if (user.uid === item.uid) {
                                            return (
                                                <div key={item.id}>
                                                    <UserPostPage post={item} />
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
                            <UserAboutPage user={user} />
                        </div>
                    </>) : ''}

                    {activeTab === 'Friend' ? (
                        <>
                            <div >
                                <UserFriendPage user={user} />
                            </div>
                        </>
                    ) : ''}



                    {activeTab === 'Photo' ? (<>
                        <div >
                            <UserMedia user={user} />
                        </div>

                    </>) : ''}


                </div>
            </div>
        </>
    )
}

export default ProfileThree

import React, { useEffect, useState } from 'react'
import "./ProfileThree.scss";
import UserPhoto from '../ParamsTab/UserPhoto';
import UserPostPage from "./../ParamsTab/UserPostPage";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import UserFriendPage from '../ParamsTab/UserFriendPage';

const ProfileThree = ({ user }) => {

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

    const colRef = collection(db, 'AllPosts');
    const q = query(colRef, orderBy('bytime', 'desc'));
    useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);


    return (
        <>
            <div className="profileThree-container">

                <div className="tab">
                    <button className="tablinks active" onClick={(event) => openCity(event, 'Post')}>Post</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'About')}>About</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Friend')}>Friend</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Photo')}>Photos</button>
                </div>

                <div className='content-div'>

                    <div id="Post" className="tabcontent w3-animate-opacity" style={{ display: "block" }}>

                        {api.map((item) => {
                            if (user.uid === item.uid) {
                                return (
                                    <>
                                        <UserPostPage post={item} />
                                    </>
                                )
                            }
                        })}


                        {/* Profile Locked */}
                    </div>

                    <div id="About" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        {/* <About /> */}
                        Profile Locked
                    </div>

                    <div id="Friend" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        <UserFriendPage user={user} />
                    </div>

                    <div id="Photo" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        <UserPhoto user={user} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileThree

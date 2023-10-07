import React, { useContext, useEffect, useState } from 'react'
import "./ProfileOne.scss";
import { useNavigate } from 'react-router-dom';
import { BsFillCameraFill } from "react-icons/bs";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';

const ProfileOne = ({ user }) => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [imageUrl, setImageUrl] = useState(null);


    useEffect(() => {
        const fetchProfileData = async () => {
            const docRef = doc(db, "UpdateProfile", currentUser?.uid ?? "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setImageUrl(data.imageUrl);
            }
        };
        fetchProfileData();
    }, [currentUser?.uid]);

    const [coverImg, setCoverImg] = useState([]);
    const [loadingCoverData, setLoadingCoverData] = useState(true);


    useEffect(() => {
        const colRef = collection(db, 'UpdateProfile');
        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setCoverImg(newApi);
                setLoadingCoverData(false);
            });

            return () => {
                // Cleanup the subscription when the component unmounts
                unsubscribe();
            };
        }, 1000);

        // Clear the delay if the component unmounts before the delay completes
        return () => clearTimeout(delay);
    }, []);


    function on() {
        document.getElementById("ProfileOneImg").style.display = "block";
    }

    function off() {
        document.getElementById("ProfileOneImg").style.display = "none";
    }

    return (
        <>
            {loadingCoverData ? (

                <div className='placeholder-glow loading-profile-cover-photo-div'>
                    <div className="placeholder placeholder-dimension bg-lightPostIcon dark:bg-darkPostIcon">
                        <div className="placeholder-dimension-img bg-[white] dark:bg-darkDiv"></div>
                    </div>
                </div>
            )
                : (

                    <>
                        <div>
                            <div id="ProfileOneImg" onClick={off}>
                                <div id="ProfileOneImg-text">
                                    <img src={user.userPhoto} className='ProfileOneImg-photo' alt="" />
                                </div>
                            </div>

                            <div>
                                {coverImg.map((item) => {
                                    if (item.uid === user.uid) {

                                        return (
                                            <div key={item.id}>
                                                <div className="profile-cover-photo-div"
                                                    style={{ backgroundImage: `url(${item.CoverPhoto ? item.CoverPhoto : 'https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80'})` }}
                                                >
                                                    <div className="profile-cover-camera-btn-div-main">
                                                        <BsFillCameraFill className='profile-cover-camera-btn' />
                                                    </div>


                                                    {item && item.VideoCover ?
                                                        (<video className="Profile-Cover-Video " autoPlay muted loop>
                                                            <source src={item && item.VideoCover} />
                                                        </video>)

                                                        :
                                                        null
                                                    }

                                                    <div className="profile-pic-bg-div">
                                                        <div className="profile-pic-div" style={{ backgroundImage: `url(${user && user.userPhoto})` }} onClick={on}></div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    }

                                })}


                            </div>
                        </div>
                    </>

                )
            }

        </>
    )
}

export default ProfileOne

import React, { useContext, useEffect, useState } from 'react'
import "./ProfileAbout.scss";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { AuthContext } from '../../../AuthContaxt';
import "./../../../UserProfile/Tab/About.scss";

const ProfileAbout = ({ user }) => {
    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    return (
        <div>
            {api.map((item) => {
                if (user.uid === item.uid) {
                    return (
                        <>
                            <div className='About-main-container'>

                                <div className="details-wrapper bg-lightDiv dark:bg-darkDiv">

                                    <div className="your-detail-container">
                                        <div className="detail-div-group">
                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>School </samp>
                                                {item.school ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'> {item.school}
                                                    </span>
                                                    :
                                                    null}
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>College </samp>
                                                {item.college ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'> {item.college}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>Work </samp>
                                                {item.work ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'>
                                                        {item.work}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'> From </samp>
                                                {item.from ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'> {item.from}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </>
                    )
                }
            })}
        </div>
    )
}

export default ProfileAbout
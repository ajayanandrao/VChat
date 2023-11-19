import React, { useEffect, useState } from 'react'
import "./UserAboutPage.scss";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import "./../../UserProfile/Tab/About.scss";

const UserAboutPage = ({ user }) => {

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
                        <div key={item.id}>
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
                                                    <div className="about-null-item bg-light_0 dark:bg-dark"></div>
                                                    }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>College </samp>
                                                {item.college ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'> {item.college}
                                                    </span>
                                                    :
                                                    <div className="about-null-item bg-light_0 dark:bg-dark"></div>
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>Work </samp>
                                                {item.work ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'>
                                                        {item.work}
                                                    </span>
                                                    :
                                                    <div className="about-null-item bg-light_0 dark:bg-dark"></div>
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'> From </samp>
                                                {item.from ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-light_0 dark:bg-dark'> {item.from}
                                                    </span>
                                                    :
                                                    <div className="about-null-item bg-light_0 dark:bg-dark"></div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default UserAboutPage
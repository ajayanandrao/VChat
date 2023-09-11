import React, { useEffect, useState } from 'react'
import "./UserAboutPage.scss";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';

const UserAboutPage = ({user}) => {

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

                                <div className="details-wrapper">

                                    <div className="your-detail-container" style={{ margin: "0" }}>
                                        <div className="detail-div-group">
                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName'>School </samp>
                                                {item.school ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'> {item.school}
                                                    </span>
                                                    :
                                                    null}
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName'>College </samp>
                                                {item.college ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'> {item.college}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName'>Work </samp>
                                                {item.work ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'>
                                                        {item.work}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName'> From </samp>
                                                {item.from ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'> {item.from}
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

export default UserAboutPage
import React, { useContext, useEffect, useState } from 'react'
import "./Feedback.scss";
import {
    Timestamp,
    addDoc,
    arrayUnion,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';




const Feedback = () => {
    const { currentUser } = useContext(AuthContext);
    const [feedback, setFeedback] = useState("")

    const feedRef = collection(db, "feedback");

    const handleSubmit = async () => {
        addDoc(feedRef, {
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
            feedback: feedback,
            timestamp: serverTimestamp(),
        })
    }

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(feedRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        })
        return unsub;
    }, []);


    function PostTimeAgoComponent({ timestamp }) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

        if (diffInSeconds < 60) {
            return "just now";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}min ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    }

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);
    
            try {
                // Delete the document from Firestore
                await updateDoc(PresenceRefOnline, {
                    status: 'Offline',
                    presenceTime: new Date(),
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

    return (
        <div className='feedback-main-container bg-light_0 dark:bg-dark text-lightProfileName dark:text-darkProfileName'>
            <div className="left">d</div>

            <div className="feedback-inner-div">
                <div className="feedback-form-div">
                    <div className='text-center text-2xl text-lightProfilename dark:text-darkProfileName mt-4'>Feedback</div>
                    <textarea class="form-control feedback-input bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName my-4" placeholder='Wright your feedback' id="exampleFormControlTextarea1" rows="3" onChange={(e) => setFeedback(e.target.value)} ></textarea>
                    <div><button className='btn btn-primary' onClick={handleSubmit}>Submit</button></div>
                </div>


                <div className='feedfback-api-div'>
                    {api.map((item) => {
                        return (
                            <div key={item.id}>
                                <div className="feedback-api-inner bg-lightDiv dark:bg-darkDiv ">
                                    <div className="feedback-profile-div">
                                        <img src={item.photoURL} className='feedback-profile-img' alt="" />
                                        <div className="feedback-profile-name text-lightProfilename dark:text-darkProfileName">{item.name}</div>
                                        <div className='feedback-time '>{<PostTimeAgoComponent timestamp={item.timestamp && item.timestamp.toDate()} />}</div>
                                    </div>
                                    <div className="feedback-text-div mt-2">
                                        {item.feedback}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Feedback
import React, { useContext, useEffect, useState } from 'react'
import "./RequestMovie.scss";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { VscClose } from 'react-icons/vsc';
import { BiCameraMovie } from 'react-icons/bi';

import ReactTimeago from 'react-timeago';
import { ImArrowLeft2 } from 'react-icons/im';

const RequestMovie = () => {
    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");

    const colRef = collection(db, 'requestMovie');

    const Handelsave = () => {
        addDoc(colRef, {
            movieName: name,
            userName: currentUser.displayName,
            photoUrl: currentUser.photoURL,
            uid: currentUser.uid,
            time: serverTimestamp()
        });

        setName("");
    }

    const [request, setRequest] = useState([]);
    useEffect(() => {
        const reqRef = collection(db, 'requestMovie');
        const q = query(reqRef, orderBy('time', 'desc'));

        const unsub = onSnapshot(q, (snapshot) => {
            const newRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRequest(newRequests);
        });

        return unsub;
    }, []);

    const handleDelete = async (id) => {
        try {
            const requestDocRef = doc(db, 'requestMovie', id);
            if (currentUser && currentUser.uid === request.find((item) => item.id === id)?.uid) {
                await deleteDoc(requestDocRef);
            } else {
                console.log('Permission denied: You can only delete your own requests.');
            }
        } catch (error) {
            console.log('Error deleting request:', error);
        }
    };

    function TimeAgoComponent({ timestamp }) {
        return <ReactTimeago date={timestamp} />;
    }

    return (
        <>
            <div className='request-container'>

                <div className="mb-3">
                    <label className="form-label"> <BiCameraMovie style={{ fontSize: "24px", marginRight: "10px" }} /> Movie Name</label>
                    <textarea onChange={(e) => setName(e.target.value)} value={name}
                        className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
                <button className='btn-primary-custom' onClick={Handelsave}>Save</button>

                <div className="request-list-div">
                    {request.map((item) => {
                        return (
                            <>
                                <div className="request-profile-div">
                                    <img src={item.photoUrl} className='request-profile-img' alt="" />
                                    <div className='request-profile-name'>
                                        {item.userName}

                                        <div style={{ fontSize: "12px", color: "#848484" }}>
                                            <TimeAgoComponent timestamp={item.time && item.time.toDate()} />
                                        </div>
                                    </div>


                                    {currentUser && currentUser.uid === item.uid && (
                                        <div className="request-close">
                                            <VscClose style={{ fontSize: '18px' }} onClick={() => handleDelete(item.id)} />
                                        </div>
                                    )}
                                </div>

                                <div className="request-list-container">
                                    <div className='request-movie-name'>{item.movieName}</div>
                                </div>
                            </>
                        )
                    })}
                </div>

            </div>
        </>
    )
}

export default RequestMovie

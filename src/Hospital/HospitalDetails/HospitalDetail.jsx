import React, { useState, useEffect } from 'react';
import "./HospitalDetail.scss";
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContaxt';
import Audio from '../../Audio';

const HospitalDetail = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();

    const [hospital, setHospital] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'Hospital', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setHospital({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);


    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // Simulate a delay of 2 seconds (you can adjust the delay as needed)
                setTimeout(async () => {
                    const friendsQuery = query(
                        collection(db, `allFriends/${currentUser.uid}/Message`),
                        orderBy('time', 'asc') // Reverse the order to show newest messages first
                    );

                    const unsubscribe = onSnapshot(friendsQuery, (friendsSnapshot) => {
                        const friendsData = friendsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        // Reverse the order of messages to show newest messages first
                        setMessages(friendsData.reverse());
                    });

                    // Return the unsubscribe function to stop listening to updates when the component unmounts
                    return () => unsubscribe();
                }, 1000); // Delay for 2 seconds (2000 milliseconds)
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                // Query all documents in the specific collection
                const messageCollection = collection(db, `allFriends/${currentUser.uid}/Message`);
                const querySnapshot = await getDocs(messageCollection);

                // Iterate through the documents and update each one to set the "sound" field to null
                querySnapshot.forEach(async (doc) => {
                    const docRef = doc.ref;
                    // console.log(docRef);
                    await updateDoc(docRef, {
                        sound: "off"
                    });
                });

                // console.log('The "sound" field in all documents of the specified collection has been set to null.');
            } catch (error) {
                console.error('Error updating "sound" field:', error);
            }
        }, 1000); // 5 seconds

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    });

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await deleteDoc(PresenceRefOnline);
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
        <div className='hospitalDetail-main-container bg-light_0 dark:bg-dark '>
            <div className="left"></div>
            <div className="hospitalDetail-main-inner-container text-lightProfileName dark:text-darkProfileName">

                {messages.slice(0, 1).map((sms) => {
                    return (
                        <div key={sms.id}>
                            {sms.sound === "on" ? <Audio /> : null}
                        </div>
                    );
                })}


                {
                    hospital ?
                        (<div className='w-100'>

                            <div className="hospital-image-div" style={{ backgroundImage: `url(${hospital.image})` }}></div>
                            <p className='hospital-name'>{hospital.hospitalName}</p>


                            <div className="hospital-detail-div">
                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Contact
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.contact}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Address
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.address}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Pin Code
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.pin}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Taluka
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.taluka}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        District
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.distic}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        State
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.state}
                                    </div>
                                </div>
                            </div>

                        </div>)
                        :
                        null
                }

                <div style={{ width: "100%", height: "80px" }}></div>
            </div>
        </div>
    )
}

export default HospitalDetail
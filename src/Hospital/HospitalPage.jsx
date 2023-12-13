import React, { useContext, useEffect, useState } from 'react'
import "./Hospital.scss";
import { AuthContext } from '../AuthContaxt';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { CgClose } from "react-icons/cg";
import Audio from '../Audio';

const HospitalPage = () => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'Hospital');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    const DeleteHospital = async (id) => {
        const docRef = doc(db, "Hospital", id);
        try {
            if (id) {
                await deleteDoc(docRef);
            }
        } catch {

        }
    }

    const [search, setSearch] = useState("");
    const filteredClinik = api.filter(item =>
        item.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        item.taluka.toLowerCase().includes(search.toLowerCase()) ||
        item.address.toLowerCase().includes(search.toLowerCase()) ||
        item.distic.toLowerCase().includes(search.toLowerCase())
    );

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
    }, [currentUser && currentUser.uid]);

    return (
        <div className='hospital-main-container bg-light_0 dark:bg-dark '>
            {messages.slice(0, 1).map((sms) => {
                return (
                    <div key={sms.id}>
                        {sms.sound === "on" ? <Audio /> : null}
                    </div>
                );
            })}

            <Link to={"/add_hospitals/"}>
                <div className='w-create-bio-btn'>
                    <FaPlus style={{ fontSize: "18px" }} />
                </div>
            </Link>

            <div className="leftDiv"></div>

            <div className="hospital-wrapper-div">

                <div className='hospital-search-div'>
                    <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostIcon"></i>
                    <input type="text" placeholder='Search'
                        className='weddinglist-search bg-lightDiv text-lightPostList dark:bg-darkDiv dark:text-darkPostText'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>


                <div className='hospital-wrapper'>
                    <div>
                        {filteredClinik.map((item) => {

                            return (
                                <Link to={`/hospitalsDetail/${item.id}`} className='my-4 w-100' key={item.id}>

                                    <div className="weddingList-card-container bg-lightDiv dark:bg-darkDiv">

                                        <div className="weddingList-profile-div">
                                            {
                                                currentUser.uid === "qHIcUV2VcxQ11kasusyE5kFZ1713" ?
                                                    (<>
                                                        <div className="deleteHospital" onClick={() => DeleteHospital(item.id)}>
                                                            <CgClose className='text-lightProfileName dark:text-darkProfileName' />
                                                        </div>
                                                    </>)
                                                    :
                                                    null
                                            }


                                            <div className="wedding-photo-div">
                                                {item.image ?
                                                    <img src={item.image} className='weddingList-photo' alt="" />
                                                    :
                                                    <div className="weddingList-photo-load"></div>
                                                }
                                            </div>

                                            <div className="weddingList-about-div">
                                                <div className='hospial-name  text-lightProfileName dark:text-darkProfileName'>{item.hospitalName}</div>
                                                <div className='hopital-docName  text-lightProfileName dark:text-darkProfileName'>
                                                    {item.doctorName ? <>

                                                        Dr.{item.doctorName}
                                                    </>
                                                        :
                                                        null
                                                    }
                                                    <div className='text-lightProfileName dark:text-darkProfileName' style={{ fontSize: "14px", textTransform: "uppercase" }}>{item.qualification}</div>
                                                </div>

                                                <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                    <div className="hospital-item-category">Contact</div>
                                                    <div className="hospital-item text-lightPostText dark:text-darkPostText">{item.contact}</div>
                                                </div>
                                                <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                    <div className="hospital-item-category">Time</div>
                                                    <div className="hospital-item text-lightPostText dark:text-darkPostText">{item.time}</div>
                                                </div>
                                                <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName ">
                                                    <div className="hospital-item-category">Address</div>
                                                    <div className="hospital-item lightPostText dark:text-darkPostText">{item.address}</div>
                                                </div>
                                                <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                    <div className="hospital-item-category">Taluka</div>
                                                    <div className="hospital-item lightPostText dark:text-darkPostText">{item.taluka}</div>
                                                </div>
                                                <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                    <div className="hospital-item-category ">District</div>
                                                    <div className="hospital-item lightPostText dark:text-darkPostText">{item.distic} {item.pin}</div>
                                                </div>
                                                <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                    <div className="hospital-item-category ">State</div>
                                                    <div className="hospital-item lightPostText dark:text-darkPostText">{item.state}</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HospitalPage
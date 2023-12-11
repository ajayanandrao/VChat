import React, { useContext, useEffect, useState } from 'react'
import "./Vgallery.scss"
import { Link } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import Audio from '../Audio';

const Vgallery = () => {
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

    const [on, setOn] = useState(false);
    const AddRegionOVerlay = () => {
        setOn(!on);
        setRegion("")
        setCast("")
        setDistic("")
    }

    const [region, setRegion] = useState("");
    const [cast, setCast] = useState("");
    const [distic, setDistic] = useState("");

    const handleSaveAbout = async (id) => {
        try {
            const colRef = doc(db, 'users', id);
            const updatedFields = {};

            if (region) {
                updatedFields.region = region;
            }
            if (cast) {
                updatedFields.subCast = cast;
            }
            if (distic) {
                updatedFields.distic = distic;
            }

            await setDoc(colRef, updatedFields, { merge: true });

            setRegion("")
            setCast("")
            setDistic("")
            AddRegionOVerlay()

        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    };

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
        <div className='d-flex'>
            <div className="left"></div>
            <div className="gallery-main-container bg-light_0 dark:bg-dark">

                {messages.slice(0, 1).map((sms) => {
                    return (
                        <div key={sms.id}>
                            {sms.sound === "on" ? <Audio /> : null}
                        </div>
                    );
                })}

                <p className='text-gallery text-lightProfileName dark:text-darkProfileName'>V Gallery</p>

                <div className="gallery-center-div">
                    <div className="gallery-card bg-lightDiv dark:bg-darkDiv" style={{ backgroundImage: `url(${"https://c0.wallpaperflare.com/preview/988/68/836/patient-nurse-human-activity.jpg"})` }}>
                        <Link to="/hospitals/" className='link' style={{ width: "100%", height: "100%" }}>
                            <p className='gallery-card-text'>The Hospital</p>
                        </Link>
                    </div>


                    {api.map((item) => {
                        if (currentUser.uid === item.uid) {
                            return (
                                <>
                                    {item.region || item.subCast ?
                                        (<>
                                            <div className="gallery-card bg-lightDiv dark:bg-darkDiv" style={{ backgroundImage: `url(${"https://img.freepik.com/free-photo/groom-putting-ring-bride-s-finger_1157-338.jpg"})` }}>
                                                <Link to="/Wedding/" className='link' style={{ width: "100%", height: "100%" }}>
                                                    <p className='gallery-card-text'>Matrimony</p>
                                                </Link>
                                            </div>
                                        </>)
                                        :

                                        (<>

                                            {on ?

                                                <div className="addRegionOverlay-div">
                                                    <div className="addRegionOverlay-inner-div">
                                                        <p style={{ fontSize: "30px" }} className='mb-3'>Add Your Info</p>
                                                        <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className='addRegionInput bg-light_0 text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' placeholder='religion' />
                                                        <input type="text" value={cast} onChange={(e) => setCast(e.target.value)} className='addRegionInput bg-light_0 text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' placeholder='Sub Cast' />
                                                        <input type="text" value={distic} onChange={(e) => setDistic(e.target.value)} className='addRegionInput bg-light_0 text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' placeholder='Distic' />

                                                        <div className='d-flex mt-2'>
                                                            <button className='btn btn-primary me-3' onClick={() => handleSaveAbout(item.id)} style={{ fontSize: "16px", padding: "8px 20px" }}>Save</button>

                                                            <div className='cursor-pointer ms-3' onClick={AddRegionOVerlay} style={{ fontSize: "16px", padding: "8px 20px" }}>Cancel</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                :
                                                null
                                            }

                                            <div className="gallery-card bg-lightDiv dark:bg-darkDiv" style={{ backgroundImage: `url(${"https://img.freepik.com/free-photo/groom-putting-ring-bride-s-finger_1157-338.jpg"})` }}>
                                                <div onClick={AddRegionOVerlay} className='link' style={{ width: "100%", height: "100%" }}>
                                                    <p className='gallery-card-text'>Matrimony</p>
                                                </div>
                                            </div>
                                        </>)

                                    }

                                </>
                            )

                        }
                    })}

                    {/* <div className="gallery-card bg-lightDiv dark:bg-darkDiv" style={{ backgroundImage: `url(${"https://c0.wallpaperflare.com/preview/988/68/836/patient-nurse-human-activity.jpg"})` }}>
                        <Link to="/electronics/" className='link' style={{ width: "100%", height: "100%" }}>
                            <p className='gallery-card-text'>Electronics Device</p>
                        </Link>
                    </div> */}

                </div>
            </div>

        </div>
    )
}

export default Vgallery
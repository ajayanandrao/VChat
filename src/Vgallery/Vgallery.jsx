import React, { useContext, useEffect, useState } from 'react'
import "./Vgallery.scss"
import { Link } from 'react-router-dom'
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';

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

    return (
        <div className='d-flex'>
            <div className="left"></div>
            <div className="gallery-main-container bg-light_0 dark:bg-dark">



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

                </div>
            </div>

        </div>
    )
}

export default Vgallery
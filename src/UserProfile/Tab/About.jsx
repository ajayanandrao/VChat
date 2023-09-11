import React, { useContext, useEffect, useState } from 'react'
import "./About.scss";
import { HiPencil } from 'react-icons/hi';
import { FaSchool } from 'react-icons/fa';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';

const About = () => {
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

    const [aboutOverlay, setAboutOverlay] = useState(false);
    const [aboutIntro, setAboutIntro] = useState(false);

    const [intro, setIntro] = useState("");

    const [school, setSchool] = useState("");
    const [college, setCollege] = useState("");
    const [work, setWork] = useState("");
    const [from, setFrom] = useState("");


    const handleShowAboutIntroOverlay = () => {
        setIntro("");
        setAboutIntro(!aboutIntro);
    }


    const handleShowAboutOverlay = () => {
        setSchool("");
        setCollege("");
        setWork("");
        setFrom("");
        setAboutOverlay(!aboutOverlay);
    }

    const handleSaveAbout = async (id) => {
        try {
            const colRef = doc(db, 'users', id);
            const updatedFields = {};

            if (school) {
                updatedFields.school = school;
            }
            if (college) {
                updatedFields.college = college;
            }
            if (work) {
                updatedFields.work = work;
            }
            if (from) {
                updatedFields.from = from;
            }
            await updateDoc(colRef, updatedFields);

            // Clear input fields
            setSchool("");
            setCollege("");
            setWork("");
            setFrom("");
            handleShowAboutOverlay();
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    }

    const handleIntro = async (id) => {
        const colRef = doc(db, 'users', id);
        if (intro) {
            await updateDoc(colRef, {
                intro: intro,
            });
        }


        setIntro("");
        handleShowAboutIntroOverlay();
    };

    return (
        <>

            {api.map((item) => {
                if (currentUser.uid === item.uid) {
                    return (
                        <>
                            {aboutIntro ?
                                (<div className="about-overlay-container">
                                    <h1 className='text-3xl text-lightPostText dark:text-darkPostText'>Your Intro</h1>
                                    <div className='about-form-div'>
                                        <input type="text" className='about-input bg-lightDiv dark:bg-darkDiv text-lightPostText dark:text-darkPostText' placeholder='Write Your Intro' value={intro} onChange={(e) => setIntro(e.target.value)} />

                                        <div className="about-save-btn-div">
                                            <button className='btn btn-success' onClick={() => handleIntro(item.id)}>save</button>
                                            <button className='btn btn-outline-primary' onClick={handleShowAboutIntroOverlay}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                                )
                                :
                                null
                            }

                            {aboutOverlay ?
                                (<div className="about-overlay-container">
                                    <h1 className='text-3xl text-lightPostText dark:text-darkPostText'>Write Your Bio</h1>
                                    <div className='about-form-div'>
                                        <input type="text" className='about-input bg-lightDiv dark:bg-darkDiv text-lightPostText dark:text-darkPostText' placeholder='School' value={school} onChange={(e) => setSchool(e.target.value)} />

                                        <input type="text" className='about-input bg-lightDiv dark:bg-darkDiv text-lightPostText dark:text-darkPostText' placeholder='College' value={college} onChange={(e) => setCollege(e.target.value)} />

                                        <input type="text" className='about-input bg-lightDiv dark:bg-darkDiv text-lightPostText dark:text-darkPostText' placeholder='Work' value={work} onChange={(e) => setWork(e.target.value)} />

                                        <input type="text" className='about-input bg-lightDiv dark:bg-darkDiv text-lightPostText dark:text-darkPostText' placeholder='From' value={from} onChange={(e) => setFrom(e.target.value)} />

                                        <div className="about-save-btn-div">
                                            <button className='btn-success-custom' onClick={() => handleSaveAbout(item.id)}>save</button>
                                            <button className='btn-primary-custom' onClick={handleShowAboutOverlay}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                                )
                                :
                                null
                            }


                            <div className='About-main-container'>

                                <div className='intro-wrapper'>
                                    <h4 className='text-2xl text-lightProfileName dark:text-darkProfileName'>Your Intro</h4>
                                    <div className="about-Edit-btn bg-lightDiv dark:bg-darkPostIcon" onClick={handleShowAboutIntroOverlay}>
                                        <HiPencil className='edit-pencil text-lightPostText dark:text-darkDiv' />
                                    </div>
                                </div>

                                <div className="about-intro-div text-lightPostText dark:text-lightPostText">
                                    {item.intro}
                                </div>

                                <hr />
                                <div className="details-wrapper">
                                    <div className="your-detail-div">
                                        <h4 className='text-2xl text-lightProfileName dark:text-darkProfileName'>Your details</h4>
                                        <button className='edit-bio-btn text-lightProfileName dark:text-darkProfileName' onClick={handleShowAboutOverlay}>Edit bio</button>
                                    </div>

                                    <div className="your-detail-container">
                                        <div className="detail-div-group">
                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>School </samp>
                                                {item.school ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'> {item.school}
                                                    </span>
                                                    :
                                                    null}
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>College </samp>
                                                {item.college ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'> {item.college}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'>Work </samp>
                                                {item.work ?
                                                    <span className='d-item-detail text-lightPostText dark:text-darkPostText bg-lightDiv dark:bg-darkDiv'>
                                                        {item.work}
                                                    </span>
                                                    :
                                                    null
                                                }
                                            </div>

                                            <div className="detail-item-one">
                                                <samp className='d-item-name text-lightProfileName dark:text-darkProfileName'> From </samp>
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


        </>
    )
}

export default About
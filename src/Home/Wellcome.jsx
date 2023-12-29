import React, { useContext, useEffect, useState } from 'react'
import "./Wellcome.scss";
import { motion } from 'framer-motion';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContaxt';
import { FaChevronRight } from 'react-icons/fa';

const Wellcome = () => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();

    const dataRef = collection(db, 'Wellcome');
    const [userPhoto, setUserPhoto] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(dataRef, (snapshot) => {
            setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            setLoading(false); // Set loading to false when data is fetched
        });

        return unsub;
    }, []);

    useEffect(() => {
        userPhoto.map((item) => {
            if (currentUser && currentUser.uid === item.id && item.seen == "WelcomTrue") {
                return nav("/home");
            }
        });
    });

    const handleWelcomeFalse = async () => {
        console.log(currentUser.uid)
        if (currentUser) {
            const welcomeRef = doc(db, 'Wellcome', currentUser && currentUser.uid);

            await updateDoc(welcomeRef, {
                seen: "WelcomTrue",
            })
        }

        nav("/home");
    };

    const [wellcome, setWellcome] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWellcome(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);


    return (

        <div className='wellcome-main-container bg-lightDiv dark:bg-dark '>
            {/* <div className="left"></div> */}
            <div className="wellcome-inner-div">
                {userPhoto.map((item) => {
                    if (currentUser && currentUser.uid === item.id) {
                        return (
                            <>

                                {item && item.userPhoto ? (
                                    <>
                                        <div className="user-wrapper">


                                            {wellcome ?
                                                <motion.div
                                                    transition={{ duration: 1.5, delay: 0.5 }}
                                                    initial={{ opacity: 0, y: -100 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className='user-name'>Welcome</motion.div>
                                                :
                                                (
                                                    <>
                                                        <motion.div
                                                            transition={{ duration: 1.5, delay: 0.8 }}
                                                            initial={{ opacity: 0, y: -70 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                        >
                                                            <motion.img
                                                                transition={{ duration: 1.5, delay: 0.8 }}
                                                                initial={{ opacity: 0, y: -70 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                src={item.userPhoto} className='user-photo' alt="" />
                                                        </motion.div>

                                                        <motion.div
                                                            transition={{ duration: 1.5, delay: 0.8 }}
                                                            initial={{ opacity: 0, y: 70 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="user-name">{item.name}</motion.div>
                                                        <motion.div
                                                            transition={{ duration: 1.5, delay: 2.6 }}
                                                            initial={{ opacity: 0, }}
                                                            animate={{ opacity: 1, }}
                                                            className="user-home-btn" onClick={handleWelcomeFalse}>
                                                            <FaChevronRight id='chevronR' />
                                                        </motion.div>

                                                    </>
                                                )
                                            }

                                        </div>
                                    </>
                                )
                                    :
                                    null
                                }
                            </>
                        )
                    }
                })}
            </div>

            {/* {
                loading ? (<div className='welcome-loading-div'>Loaidng...</div>)
                    :
                    (<>

                        {userPhoto.map((item) => {
                            if (currentUser && currentUser.uid === item.id) {
                                return (
                                    <>

                                        {item && item.userPhoto ? (

                                            <div className='welcome-main-container' >
                                                <div className="welcome-center-div">
                                                    <div className='welcome-user-profile-div' >


                                                        <motion.div transition={{ duration: 0.8, delay: 2.8 }}
                                                            initial={{ opacity: 0, y: -60 }}
                                                            animate={{ opacity: 1, y: 0 }} >
                                                            <img className='welcome-user-img' src={item && item.userPhoto} alt="" />
                                                        </motion.div>

                                                        <motion.div
                                                            transition={{ duration: 0.8, delay: 3.8 }}
                                                            initial={{ opacity: 0, y: 50 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            style={{ fontSize: "18px", marginTop: "1rem" }}>Welcome</motion.div>

                                                        <motion.div
                                                            transition={{ duration: 0.8, delay: 3.8 }}
                                                            initial={{ opacity: 0, y: 50 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className='welcome-user-name text-3xl'>
                                                            {item && item.name}</motion.div>


                                                    </div>

                                                    {item && item.userPhoto ?
                                                        (
                                                            <>
                                                                {showWelcome && (
                                                                    <motion.div
                                                                        transition={{ duration: 0.8, delay: 0.5 }}
                                                                        initial={{ opacity: 0, y: 50 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className='welcome-text text-4xl'
                                                                    >
                                                                        Welcome
                                                                    </motion.div>
                                                                )}

                                                            </>
                                                        )
                                                        :
                                                        null
                                                    }

                                                    {item && item.userPhoto ?
                                                        <motion.div
                                                            transition={{ duration: 1.5, delay: 5 }}
                                                            initial={{ opacity: 0, }}
                                                            animate={{ opacity: 1, }}
                                                            className='v-intall-div'>

                                                            <div className='v-mobile-div'>
                                                                <img src="https://cdn3d.iconscout.com/3d/premium/thumb/mobile-in-hand-4416344-3675944.png?f=webp" className='v-mobile-icon' alt="" />
                                                                <img className='v-logo' src={v} alt="" />
                                                            </div>

                                                            <div className='v-intall-wrapper'>
                                                                <div style={{ fontSize: "18px" }}> install on </div>
                                                                <img src="https://cdn3d.iconscout.com/3d/free/thumb/free-android-4387633-3640294.png?f=webp"
                                                                    className='v-andro' alt="" />
                                                                <div style={{ fontSize: "18px" }}>Android</div>
                                                            </div>

                                                        </motion.div>
                                                        :
                                                        null
                                                    }

                                                </div>

                                                {item && item.userPhoto ?
                                                    <motion.div
                                                        transition={{ duration: 1.5, delay: 5 }}
                                                        initial={{ opacity: 0, y: 50 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="skip-btn-welcome" onClick={handleWelcomeFalse}>
                                                        <IoIosArrowForward />
                                                    </motion.div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        )
                                            :
                                            null
                                        }
                                    </>
                                )
                            }
                        })}
                    </>)
            } */}
        </div >
    )
}

export default Wellcome

// https://cdn3d.iconscout.com/3d/free/thumb/free-android-4387633-3640294.png?f=webp

// https://cdn3d.iconscout.com/3d/premium/thumb/mobile-in-hand-4416344-3675944.png?f=webp
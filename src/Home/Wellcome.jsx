import React, { useContext, useEffect, useState } from 'react'
import "./Wellcome.scss";
import { motion } from 'framer-motion';
import v from "./../Image/img/logo192.png";
import { IoIosArrowForward } from 'react-icons/io';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContaxt';

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

    const [showWelcome, setShowWelcome] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowWelcome(false);
        }, 3500); // Set the duration (in milliseconds) after which you want to hide the element

        return () => clearTimeout(timeout);
    }, []);

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



    return (

        <>

            {
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
                                                            className='welcome-user-name text-3xl'>{item && item.name}</motion.div>


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
            }
        </>
    )
}

export default Wellcome

// https://cdn3d.iconscout.com/3d/free/thumb/free-android-4387633-3640294.png?f=webp

// https://cdn3d.iconscout.com/3d/premium/thumb/mobile-in-hand-4416344-3675944.png?f=webp
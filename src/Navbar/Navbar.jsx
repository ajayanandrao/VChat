import React, { useContext, useState } from 'react'
import "./Navbar.scss";
import { AiFillHeart, AiFillHome } from "react-icons/ai"
import { MdMovieFilter } from 'react-icons/md';
import { BsMessenger } from 'react-icons/bs';
import { RiMessengerFill } from 'react-icons/ri';
import { AuthContext } from '../AuthContaxt';
import { motion } from 'framer-motion';

import v from "./../Image/v.png"
import hr from "./../Image/hr.png"
import ghar from "./../Image/g.png"
import m from "./../Image/m.png"

const Navbar = () => {
    const { currentUser } = useContext(AuthContext);

    const [view, setView] = useState(false);

    const handleBoll = () => {
        setView(!view);
    };


    return (
        <div>

            <div className='boll' onClick={() => { handleBoll() }} >
                <div class="intro-banner-vdo-play-btn pinkBg" target="_blank" onClick={handleBoll}>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                    <span class="ripple pinkBg" onClick={handleBoll}></span>
                </div>
            </div>


            <div className="sideNavbar">
                <div className="circle-div">
                    {view ?
                        <motion.div
                            transition={{ duration: 0.5, delay: 0.2 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-home">
                            {/* <AiFillHome /> */}
                            <img src={ghar} className='v' alt="" />
                        </motion.div>
                        :
                        null
                    }
                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.1 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-heart">
                            {/* <AiFillHeart /> */}
                            <img src={hr} className='v' alt="" />
                        </motion.div>
                        :
                        null
                    }

                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-video">
                            {/* <MdMovieFilter /> */}
                            <img src={v} className='v' alt="" />
                        </motion.div>
                        :
                        null
                    }

                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.3 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-sms">
                            {/* <RiMessengerFill /> */}
                            <img src={m} className='v' alt="" />
                        </motion.div>
                        :
                        null
                    }

                    {view ?
                        <motion.div
                            transition={{ duration: 0.3, delay: 0.4 }}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="c-profile">
                            <img src={currentUser && currentUser.photoURL} className='c-profile-img' alt="" />
                        </motion.div>
                        :
                        null
                    }
                </div>
            </div>

        </div >
    )
}

export default Navbar
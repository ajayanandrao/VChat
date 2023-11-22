import React, { useContext } from 'react'
import "./Animation.scss";
import { AuthContext } from '../AuthContaxt';
import { Link } from 'react-router-dom';
import photo from './../Image/img/photo.png';
import smile from './../Image/img/two.png';
import { BiSend, BiSolidSend } from 'react-icons/bi';
import { FaShare } from 'react-icons/fa';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsFillChatDotsFill, BsFillHeartFill, BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import image from "./../Image/img/c4.png"
import g1 from "./../Image/img/g1.jpg"
import prad from "./../Image/img/p.jpg"
import { motion } from 'framer-motion';



const Animation = () => {
    const { currentUser } = useContext(AuthContext);
    return (
        <div className='d-flex'>
            {/* <div className="left"></div> */}
            <div className="ani-main-div bg-light_0 dark:bg-dark">

                <motion.div
                    transition={{ duration: 1.5, delay: 0.5 }}
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1,  }}
                    className="post-contianer " style={{position:"relative", zIndex:"2"}}>
                    <div className="post-div dark:bg-darkDiv bg-lightDiv dark:bg-darkDiv">
                        <div className="post-padding">
                            <div className="post-profile-div">
                                <div>
                                    <Link to={'/profile'} >
                                        <div
                                            style={{ backgroundImage: `url(${currentUser && currentUser.photoURL})` }}
                                            className="post-img"
                                        >
                                            <div className="post-img-dot" />
                                        </div>
                                    </Link>
                                </div>

                                <input
                                    type="text"
                                    className="post-input bg-light_0 text-lightProfileName dark:bg-darkInput dark:text-darkProfileName"
                                    placeholder="What's on your mind ? "

                                />
                                <div className="post-send-text text-[#2F97E2] dark:text-[white]">
                                    Post
                                </div>
                            </div>

                            <div className="post-icon-container">
                                <label htmlFor="photo" style={{ cursor: 'pointer' }}>
                                    <div className="post-icon-div">
                                        <img src={photo} className="post-icon" alt="" />
                                        <div className="post-icon-text text-lightPostText dark:text-[white]">Photo/Video</div>
                                    </div>
                                    <input
                                        type="file"
                                        id="photo"
                                        accept="image/*, video/*"

                                        style={{ display: 'none' }}
                                    />
                                </label>



                                <div className="post-icon-div" >
                                    <img src={smile} className="post-icon" alt="" />
                                    <div className="post-icon-text text-lightPostText dark:text-[white]">Emoji</div>
                                </div>
                            </div>

                            <div
                                id="less"
                                className="mt-3"
                                style={{
                                    textAlign: 'center',
                                    color: 'red',
                                    fontSize: '16px'
                                }}
                            />

                        </div>

                    </div>
                </motion.div>

                <motion.div
                    transition={{ duration: 1.3, delay: 4 }}
                    initial={{ opacity: 0, y: -50, display: "none" }}
                    animate={{ opacity: 1, y: 0, display: "flex" }}
                    className="feed-container" style={{position:"relative", zIndex:"1"}}>
                    <div className="feed-div bg-lightDiv dark:bg-darkDiv">
                        <div className="feed-profile-div">
                            <div className='link d-flex align-items-center'>
                                <img src={g1} className='feed-img' alt="" />

                                <div className="feed-profile-name text-lightProfileName dark:text-darkProfileName">
                                    Nikita Patil
                                </div>
                            </div>
                            <div className="feed-time text-lightPostTime dark:text-darkPostTime">
                                just

                            </div>
                        </div>

                        <div className="feed-post-text text-lightPostText dark:text-darkPostText">
                            just looking a Wow. Wow... 😀😅😅😅
                        </div>

                        <div className="feed-post-container">
                            <img width={"300px"} src={image} alt="Uploaded" className="Feed-Post-img" />
                        </div>

                        <div className="feed-bottom-container">
                            <div className="feed-bottom-mainu">
                                <div className="feed-bottom-like-div" >
                                    <BsFillHeartFill className='feed-bottom-like-heart' color='#FF0040' />
                                    <div className="feed-bottom-like-count bg-lightPostIconBottom text-lightPostText dark:bg-darkPostIcon  dark:text-darkPostText " >
                                        8
                                    </div>
                                </div>
                            </div>
                            <div className="feed-bottom-like-div">
                                <BsFillChatDotsFill className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                            </div>
                            <div className="feed-bottom-mainu">
                                <FaShare className='feed-bottom-icon text-lightPostIconBottom dark:text-darkPostIcon'
                                />
                            </div>
                        </div>
                    </div>
                </motion.div >

                <motion.div
                    transition={{ duration: 1, delay: 2 }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="feed-container" style={{position:"relative", zIndex:"1"}}>
                    <div className="feed-div bg-lightDiv dark:bg-darkDiv">
                        <div className="feed-profile-div">
                            <div className='link d-flex align-items-center'>
                                <img src={prad} className='feed-img' alt="" />

                                <div className="feed-profile-name text-lightProfileName dark:text-darkProfileName">
                                    Pradnya Salve
                                </div>
                            </div>
                            <div className="feed-time text-lightPostTime dark:text-darkPostTime">
                                just

                            </div>
                        </div>

                        <div className="feed-post-text text-lightPostText dark:text-darkPostText">
                            my new pic 😎
                        </div>

                        <div className="feed-post-container">
                            <img width={"300px"} src={prad} alt="Uploaded" className="Feed-Post-img" />
                        </div>

                        <div className="feed-bottom-container">
                            <div className="feed-bottom-mainu">
                                <div className="feed-bottom-like-div" >
                                    <BsFillHeartFill className='feed-bottom-like-heart' color='#FF0040' />

                                </div>
                            </div>
                            <div className="feed-bottom-like-div">
                                <BsFillChatDotsFill className='feed-bottom-like-heart text-lightPostIconBottom dark:text-darkPostIcon' />
                            </div>
                            <div className="feed-bottom-mainu">
                                <FaShare className='feed-bottom-icon text-lightPostIconBottom dark:text-darkPostIcon'
                                />
                            </div>
                        </div>
                    </div>
                </motion.div >

            </div>
        </div>
    )
}

export default Animation
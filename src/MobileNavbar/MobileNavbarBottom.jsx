import React, { useContext } from 'react'
import { AiFillHeart, AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { MdMovieFilter } from "react-icons/md";
import { AuthContext } from "../AuthContaxt";

import "./MobileNavbarBottom.scss";

const MobileNavbarBottom = () => {
    const { currentUser } = useContext(AuthContext);


    return (
        <>
            <div className="bottom-navbar-container">
                <Link to={"home/"}>
                    {/* <img src={home} width={"30px"} alt="" /> */}
                    <AiFillHome className='mobile-nav-bottom-icon' />
                </Link>
                <Link to="notification">
                    <div>
                        {/* <img src={heart} style={{width:"28px"}} alt="" /> */}
                        <AiFillHeart className="mobile-nav-bottom-icon" />
                    </div>
                </Link>

                <Link to="message/">
                    <div>
                        <i className="bi bi-messenger"></i>
                        {/* <img src={sms} style={{width:"28px"}} alt="" /> */}
                    </div>
                </Link>

                <Link to="reels">
                    <div>
                        {/* <img src={video} className="mobile-nav-icons" alt="" /> */}
                        <MdMovieFilter className="mobile-nav-bottom-icon" />
                    </div>
                </Link>
                <Link to={"profile/"}>
                    <div>
                        <img
                            src={currentUser && currentUser.photoURL}
                            alt=""
                            className="mobile-nav-bottom-photo"
                        />
                    </div>
                </Link>
            </div>
        </>
    )
}

export default MobileNavbarBottom
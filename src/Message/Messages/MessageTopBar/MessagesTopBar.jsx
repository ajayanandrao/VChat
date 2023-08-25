import React, { Fragment } from 'react'
import "./MessagesTopBar.scss";
import { useNavigate } from 'react-router-dom';

const MessagesTopBar = ({user}) => {
    
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }


    return (
        <Fragment>
            <div className="message-profile-div">
                <i onClick={goBack} className="bi bi-arrow-left message-arrow "></i>
                <img className='message-profile-img' src={user.userPhoto} alt="" />
                <span className='message-profile-name'>{user.name}</span>
            </div>

        </Fragment>
    )
}

export default MessagesTopBar
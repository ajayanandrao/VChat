import React, { Fragment } from 'react'
import "./SelectedReplyShow.scss";
import { CircularProgress } from '@mui/material';
import { MdClose } from 'react-icons/md';

const SelectedReplyShow = ({ viewMessageImg, hideX, setSelectedMessageId, viewMessageInput,
    setViewMessageInput, setViewMessageImg, setViewReplyImgLikeUrl, }) => {
    return (
        <Fragment>


            <div className='view-Reply'>
                <div className='view-replay-sms'>
                    <div style={{ fontWeight: "600" }}> {viewMessageInput}</div>


                </div>
                <div id='view' style={{ display: "none" }}

                    onClick={() => {

                        hideX();
                        setSelectedMessageId("");
                        setViewMessageInput("");
                        setViewMessageImg(null);
                        setViewReplyImgLikeUrl(null);

                    }}

                    className='view-close-btn m-3'>
                    <MdClose style={{ fontSize: "24px" }} />
                </div>
            </div>



            <div className="imgSelected-div">
                <div className="loading">
                    <CircularProgress id='progress' style={{ display: "none" }} />
                </div>
                {viewMessageImg ? <img src={(viewMessageImg)} className='imgSelected-img' alt="" /> : ""}

            </div>
        </Fragment>
    )
}

export default SelectedReplyShow
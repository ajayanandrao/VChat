import React, { Fragment } from 'react'
import "./ViewVideo.scss";
import { MdDelete } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';

const ViewVideo = ({ viewVideoDiv, ReplyVideoFormatTimestamp, replyVideoTime, DeleteVideo, videoId, setViewVideoDiv, videoRef, videoUrl, togglePlayPause, isPlaying, }) => {
    return (
        <Fragment>

            {viewVideoDiv &&
                <div className='photo-div'>
                    <div className="photo-div-inner">

                        <div className="photo-option-div">
                            <div className="photo-delete-div">
                                <div className="photo-time"> {ReplyVideoFormatTimestamp(replyVideoTime)}</div>
                                <MdDelete onClick={() => DeleteVideo(videoId)} style={{ fontSize: "26px" }} className='photo-delete' />
                            </div>
                            <div className="photo-close-div">
                                <IoMdClose onClick={() => setViewVideoDiv(false)} style={{ fontSize: "26px", color: "black" }} className='photo-delete' />
                            </div>
                        </div>

                        <div className="photo-img-div" playVideo>

                            <div className="view-video-container"  >
                                <video ref={videoRef} controls className=" viewVideoClass" >
                                    <source src={videoUrl} />
                                </video>
                                <div className="view-play-button" >
                                    <div className="view-play-btn-div" onClick={togglePlayPause}>
                                        <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} view-play-btn`}></i>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            }

        </Fragment>
    )
}

export default ViewVideo
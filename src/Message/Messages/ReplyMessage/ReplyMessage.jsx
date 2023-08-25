import React, { Fragment } from 'react'
import "./ReplyMessage.scss";

const ReplyMessage = ({reply, HandleShowReplyVdieo, videoRef, message }) => {
    return (
        <Fragment>

            {reply && (
                <div className="message-reply" >
                    {(reply.startsWith("Reply to: ") || reply.includes("Reply to video: ")) ? (
                        <>
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%", borderRadius: "0.5rem"
                            }}
                                onClick={() => HandleShowReplyVdieo(message, reply, message)}
                            >
                                {reply.includes("Reply to video: ") && (

                                    <div className="message-video-container">

                                        <video ref={videoRef} className="video messageVideo">
                                            <source src={reply.split("Reply to video: ")[1]} />
                                        </video>
                                        <div className="message-play-button">
                                            <div className="message-play-btn-div">
                                                <i className="bi bi-play-fill message-play-btn"></i>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {reply.includes("Reply to: ") && (
                                    <img src={reply.split("Reply to: ")[1]}
                                        alt="Replied Image"
                                        style={{
                                            width: "100px", height: "150px", objectFit: "cover",
                                            objectPosition: "center",
                                            borderRadius: "0.5rem"
                                        }}
                                        className="replied-image"
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: "inline-flex", lineHeight: "0px" }}>
                            <p>{reply}</p>
                        </div>
                    )}
                </div>
            )}

        </Fragment>
    )
}

export default ReplyMessage
import React, { Fragment } from 'react'
import "./SelectFromDevice.scss";
import { IoMdClose } from 'react-icons/io';
import { CircularProgress } from '@mui/material';


const SelectFromDevice = ({ setImg, img, setLoadingProgress, loadingProgress, setIsPlaying,  isPlaying, videoRef }) => {

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Fragment>

            <div className="imgSelected-div">
                <div className="loading">
                    <CircularProgress id="progress" style={{ display: "none" }} />
                </div>
                {img && img.type.startsWith("video/") ? (

                    <div className="selected-video">
                        <video ref={videoRef} className="SelectedViewVideoClass">
                            <source src={URL.createObjectURL(img)} />
                        </video>

                        <div className="selected-play-button" onClick={togglePlayPause}>
                            <div className="selected-play-btn-div">
                                {
                                    loadingProgress ?
                                        (<div style={{ color: "white" }}>{loadingProgress}</div>)
                                        :

                                        <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} selected-play-btn`}></i>
                                }
                            </div>
                        </div>
                    </div>


                ) : img ? (
                    <img src={URL.createObjectURL(img)} className="imgSelected-img" alt="" />
                ) : (
                    ""
                )}

                <div className="imgSelected-close-div">
                    {img ? (
                        <>

                            <IoMdClose className="imgSelected-close-img"
                                onClick={() => {
                                    setImg(null);
                                    setIsPlaying(false);
                                    setImg(null);
                                    setLoadingProgress(false)
                                }} />
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>

        </Fragment>
    )
}

export default SelectFromDevice
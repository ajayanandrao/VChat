import React from 'react'
import "./Vgallery.scss"
import { Link } from 'react-router-dom'

const Vgallery = () => {
    return (
        <div className='d-flex'>
            <div className="left"></div>
            <div className="gallery-main-container bg-light_0 dark:bg-dark">
                <p className='text-gallery text-lightProfileName dark:text-darkProfileName'>V Gallery</p>

                <div className="gallery-center-div">
                    <div className="gallery-card bg-lightDiv dark:bg-darkDiv" style={{ backgroundImage: `url(${"https://c0.wallpaperflare.com/preview/988/68/836/patient-nurse-human-activity.jpg"})` }}>
                        <Link to="/hospitals/" className='link' style={{ width: "100%", height: "100%" }}>
                            <p className='gallery-card-text'>The Hospital</p>
                        </Link>
                    </div>

                    <div className="gallery-card bg-lightDiv dark:bg-darkDiv" style={{ backgroundImage: `url(${"https://img.freepik.com/free-photo/groom-putting-ring-bride-s-finger_1157-338.jpg"})` }}>
                        <Link to="/Wedding/" className='link' style={{ width: "100%", height: "100%" }}>
                            <p className='gallery-card-text'>Matrimony</p>
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Vgallery
import React, { Fragment } from 'react'
import "./ViewPhoto.scss";
import { MdDelete } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';


const ViewPhoto = ({photo, PhotoFormatTimestamp, photoTime, Delete_Photo_Video, photoid, setPhoto,   }) => {
    return (
        <Fragment>

            {photo &&
                <div className='photo-div'>
                    <div className="photo-div-inner">

                        <div className="photo-option-div">
                            <div className="photo-delete-div">
                                <div className="photo-time"> {PhotoFormatTimestamp(photoTime)}</div>
                                <MdDelete onClick={() => Delete_Photo_Video(photoid)} style={{ fontSize: "26px" }} className='photo-delete' />
                            </div>
                            <div className="photo-close-div">
                                <IoMdClose onClick={() => setPhoto(null)} style={{ fontSize: "26px", color: "black" }} className='photo-delete' />
                            </div>
                        </div>

                        <div className="photo-img-div">
                            <img src={photo} className='photo-img' alt="" />
                        </div>


                    </div>
                </div>
            }

        </Fragment>
    )
}

export default ViewPhoto
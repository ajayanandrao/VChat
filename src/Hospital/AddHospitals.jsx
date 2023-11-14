import React from 'react'
import "./AddHospital.scss";
import logo from "./../Image/img/logo192.png"
import LeftArro from '../LeftArro';

const AddHospitals = () => {
    return (
        <div className='addHospital-main-container bg-light_0 dark:bg-dark'>
            <div className="left"></div>
            <LeftArro />
            <div className="addHospital-container">
                <div className="addHospital-image-div">
                    <div className="addHospital-image-div-inner">
                        <div className="addHospital-image-color">
                            <div className="addHospital-logo-div">
                                <img src={logo} alt="" className='addHospital-logo' />VChat
                            </div>
                            <p className='addHospital-text'> we use this information for people to search hospitals fast and easy  </p>
                        </div>
                    </div>
                </div>

                <div className='addHospital-Title text-lightProfileName dark:text-darkProfileName'>Add A Hopital</div>

                <div className="addHospital-div ">
                    <div className="addHoptial-wrapper bg-lightDiv dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                        <div className="addHospital-item-div">
                            <div className="addHostpital-item-category">Hospital Name</div>
                            <input type="text" placeholder='Hospital Name' className='addHospital-input bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Qualification</div>
                            <input type="text" placeholder='Doctor Qualification' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Contact</div>
                            <input type="text" placeholder='Contact' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Address</div>
                            <input type="text" placeholder='Address' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Taluka</div>
                            <input type="text" placeholder='Taluka' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">District</div>
                            <input type="text" placeholder='District' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Pin Code</div>
                            <input type="text" placeholder='Pin Code' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category"></div>
                            <button className='btn btn-success '>Submit</button>
                        </div>
                    </div>
                </div>
                <div className="margin"></div>

            </div>
        </div>
    )
}

export default AddHospitals
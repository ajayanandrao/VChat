import React from 'react'
import "./LaptopDetail.scss";
import { FaShare } from 'react-icons/fa';

const LaptopDetail = () => {
    return (
        <div className='d-flex'>
            <div className="left"></div>
            <div className='subDetail-main-container bg-light_0 dark:bg-dark '>
                <div className="subDetail-main-inner-container text-lightProfileName dark:text-darkProfileName">

                    <div className='w-100'>

                        <div className="sub-image-div bg-light_0 dark:bg-darkDiv" ></div>
                        <p className='sub-name'>Dell Laptop</p>

                        <div className="sub-detail-share-div">
                            2
                            <FaShare className='sub-detail-icon' />
                        </div>

                        <div className="sub-detail-div">
                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    Description
                                </div>
                                <div className="sub-detail-list">
                                    jfl kjskdj ksj fksjd lkfjs jsklj ksjd fkjsdfjsldjf jsdlfj sdjf ksjdf jsdlfkj dell inspiron 15 laptop 2 year old, with battery charger mouse
                                </div>
                            </div>

                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    Price
                                </div>
                                <div className="sub-detail-list">
                                    20500
                                </div>
                            </div>

                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    Address
                                </div>
                                <div className="sub-detail-list">
                                    nanalpeth police station parbhani 431 401
                                </div>
                            </div>

                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    Contact
                                </div>
                                <div className="sub-detail-list">
                                    8473820283
                                </div>
                            </div>

                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    Taluka
                                </div>
                                <div className="sub-detail-list">
                                    parbhani
                                </div>
                            </div>

                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    District
                                </div>
                                <div className="sub-detail-list">
                                    parbhani
                                </div>
                            </div>

                            <div className="sub-detail-item text-lightProfileName dark:text-darkProfileName">
                                <div className="sub-detail-title">
                                    State
                                </div>
                                <div className="sub-detail-list">
                                    Maharashtra
                                </div>
                            </div>
                        </div>



                        <div className='mt-5'>
                            <div className="sub-detail-screen">
                                <div className="sub-detail-screen-card bg-lightDiv dark:bg-darkDiv"></div>
                                <div className="sub-detail-screen-card bg-lightDiv dark:bg-darkDiv"></div>
                                <div className="sub-detail-screen-card bg-lightDiv dark:bg-darkDiv"></div>
                                <div className="sub-detail-screen-card bg-lightDiv dark:bg-darkDiv"></div>
                            </div>
                        </div>
                    </div>


                    <div style={{ width: "100%", height: "80px" }}></div>
                </div>
            </div>
        </div>
    )
}

export default LaptopDetail
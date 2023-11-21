import React, { useState, useEffect } from 'react';
import "./HospitalDetail.scss";
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import { useParams } from 'react-router-dom';

const HospitalDetail = () => {
    const { id } = useParams();

    const [hospital, setHospital] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'Hospital', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setHospital({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);



    return (
        <div className='hospitalDetail-main-container bg-light_0 dark:bg-dark '>
            <div className="left"></div>
            <div className="hospitalDetail-main-inner-container text-lightProfileName dark:text-darkProfileName">

                {
                    hospital ?
                        (<div className='w-100'>

                            <div className="hospital-image-div" style={{ backgroundImage: `url(${hospital.image})` }}></div>
                            <p className='hospital-name'>{hospital.hospitalName}</p>
                            

                            <div className="hospital-detail-div">
                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Contact
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.contact}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Address
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.address}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Pin Code
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.pin}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        Taluka
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.taluka}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        District
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.distic}
                                    </div>
                                </div>

                                <div className="hospital-detail-item text-lightProfileName dark:text-darkProfileName">
                                    <div className="hospital-detail-title">
                                        State
                                    </div>
                                    <div className="hospital-detail-list">
                                        {hospital.state}
                                    </div>
                                </div>
                            </div>

                        </div>)
                        :
                        null
                }

                <div style={{ width: "100%", height: "80px" }}></div>
            </div>
        </div>
    )
}

export default HospitalDetail
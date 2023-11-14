import React, { useContext, useEffect, useState } from 'react'
import "./Hospital.scss";
import Clinik from "./../clinik.json";
import { BsTelephoneFill, BsTelephoneForwardFill } from "react-icons/bs"
import { RiTimeFill } from "react-icons/ri"
import { AuthContext } from '../AuthContaxt';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';

const HospitalPage = () => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'Hospital');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    const [search, setSearch] = useState("");
    const filteredClinik = Clinik.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        item.contact.toLowerCase().includes(search.toLowerCase()) ||
        item.taluka.toLowerCase().includes(search.toLowerCase()) ||
        item.dist.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='hospital-main-container bg-light_0 dark:bg-dark '>

            <Link to={"/add_hospitals/"}>
                <div className='w-create-bio-btn'>
                    <FaPlus style={{ fontSize: "18px" }} />
                </div>
            </Link>

            <div className="leftDiv"></div>

            <div className="hospital-wrapper-div">

                <div className='hospital-search-div'>
                    <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostIcon"></i>
                    <input type="text" placeholder='Search'
                        className='weddinglist-search bg-lightDiv text-lightPostList dark:bg-darkDiv dark:text-darkPostText'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>


                <div className='hospital-wrapper'>
                    <div>
                        {api.map((item) => {

                            return (
                                <div className='my-4 w-100' key={item.id}>

                                    <div className="weddingList-card-container bg-lightDiv dark:bg-darkDiv">

                                        <Link to={`/WeddingList/${item.id}`} className='link'>
                                            <div className="weddingList-profile-div">

                                                <div className="wedding-photo-div">
                                                    {item.image ?
                                                        <img src={item.image} className='weddingList-photo' alt="" />
                                                        :
                                                        <div className="weddingList-photo-load"></div>
                                                    }
                                                </div>

                                                <div className="weddingList-about-div">
                                                    <div className='hospial-name  text-lightProfileName dark:text-darkProfileName'>{item.hospitalName}</div>
                                                    <div className='hopital-docName  text-lightProfileName dark:text-darkProfileName'>
                                                        Dr.{item.doctorName}
                                                        <div className='text-lightProfileName dark:text-darkProfileName' style={{ fontSize: "14px", textTransform: "uppercase" }}>{item.qualification}</div>
                                                    </div>

                                                    <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                        <div className="hospital-item-category">Contact</div>
                                                        <div className="hospital-item text-lightPostText dark:text-darkPostText">{item.contact}</div>
                                                    </div>
                                                    <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                        <div className="hospital-item-category">Time</div>
                                                        <div className="hospital-item text-lightPostText dark:text-darkPostText">{item.time}</div>
                                                    </div>
                                                    <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName ">
                                                        <div className="hospital-item-category">Address</div>
                                                        <div className="hospital-item lightPostText dark:text-darkPostText">{item.address}</div>
                                                    </div>
                                                    <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                        <div className="hospital-item-category">Taluka</div>
                                                        <div className="hospital-item lightPostText dark:text-darkPostText">{item.taluka}</div>
                                                    </div>
                                                    <div className="hospital-item-div text-lightProfileName dark:text-darkProfileName">
                                                        <div className="hospital-item-category ">District</div>
                                                        <div className="hospital-item lightPostText dark:text-darkPostText">{item.distic} {item.pincode}</div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HospitalPage
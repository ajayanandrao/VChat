import { CircularProgress } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../Firebase';
import "./WeddingListDetail.scss";
import { HiOutlineArrowSmLeft } from 'react-icons/hi'

const WeddingListDetail = () => {
    const { id } = useParams();
    const [data, Data] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'WeddingDatabase', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    Data({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    if (!data) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }


    return (
        <>
            <div style={{ padding: "1rem", position: "fixed", top: "50px" }}>
                <div className="btn-close-div" onClick={goBack}>
                    <HiOutlineArrowSmLeft />
                </div>
            </div>
            <div className="weddinglistD-photo-div">
                <div>
                    <img src={data.photoOne} className='weddinglistD-photo' alt="" />
                </div>
                <h2 style={{ textTransform: "capitalize" }}>{data.first} {data.middel} {data.last}</h2>
                <div className='d-flex' style={{ fontSize: "18px", fontWeight: "600" }}>
                    {data.date}
                    <span className='mx-1'>{data.month}</span>
                    {data.years}
                </div>

            </div>
            <div className='weddinglist-mainu-wapper'>

                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Religion :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.region}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Work :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.work}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Qualification :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.qualification}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Mobile :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.mobile}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Height :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.height}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Landmark :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.landmark}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>Village :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.village}</span>
                </div>
                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>District :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.distric}</span>
                </div>

                <div className='weddinglist-mainu-item'>
                    <div className='weddinglist-mainu-item-name'>State :- </div>
                    <span className='weddinglist-mainu-item-containt' style={{ fontSize: "18px", textTransform: "capitalize" }}>{data.state}</span>
                </div>
            </div>
        </>
    )
}

export default WeddingListDetail

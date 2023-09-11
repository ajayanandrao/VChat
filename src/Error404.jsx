import React from 'react'
import "./Error.scss";
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }
    return (
        <div className='error-main-container'>
            <div className='error-back' onClick={goBack}><BsArrowLeft /></div>
            <div className='error-not-cound text-3xl mb-4'>Page Not Found</div>
            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/no-search-result-5000896-4165671.png?f=webp" alt="" />
        </div>
    )
}

export default Error404
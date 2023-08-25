import React from 'react'
import "./Wedding.scss";
import { Link, useNavigate } from 'react-router-dom';
import WeddingList from './WeddingList';
import { PiPlusBold } from 'react-icons/';
import { BiUpArrowAlt } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';


const LeftArro = () => {

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }
    return (
        <div className='back-btn-div' onClick={goBack}>
            <HiOutlineArrowSmLeft fontSize={"25px"} />
        </div>
    )
}

const WeddingMain = () => {

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };


    return (
        <>
            <LeftArro />
            <WeddingList />
            <Link to={"/AddWedding/"}>
                <div className='w-create-bio-btn'>
                    <FaPlus style={{ fontSize: "18px" }} />
                </div>
            </Link>
            <div className='w-up-bio-btn' onClick={handleScrollToTop}>
                <BiUpArrowAlt />
            </div>
        </>
    )
}

export default WeddingMain

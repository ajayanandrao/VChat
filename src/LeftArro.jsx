import React, { useEffect, useState } from 'react';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const LeftArro = () => {
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [showNavbar, setShowNavbar] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [buttonPosition, setButtonPosition] = useState(0); // New state for button position

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollUp = prevScrollPos > currentScrollPos;

            setPrevScrollPos(currentScrollPos);

            // Calculate scroll percentage
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (currentScrollPos / scrollHeight) * 100;

            // Define thresholds for showing and hiding navbar
            const hideThreshold = 0.5;
            const showThreshold = 0.1;

            setShowNavbar(
                (scrollUp && scrollPercentage > showThreshold) ||
                (!scrollUp && scrollPercentage < hideThreshold) ||
                currentScrollPos === 0
            );

            // Adjust button position based on scrolling direction
            setButtonPosition(scrollUp ? 0 : -45);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    const style = {
        width: "35px",
        height: "35px",
        backdropFilter: "blur(10px)",
        position: "fixed",
        top: `${74 + buttonPosition}px`, // Adjusted position
        left: "10px",
        zIndex: "9999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "top 0.5s ease-in-out" // Smooth animation
    }

    return (
        <div className='back-btn-di dark:text-aqua_0' style={style} onClick={goBack}>
            <HiOutlineArrowSmLeft fontSize={"25px"} />
        </div>
    );
}

export default LeftArro;

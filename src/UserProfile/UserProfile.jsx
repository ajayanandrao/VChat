import React, { useContext, useEffect, useState } from 'react'
import "./UserProfile.scss";
import UserProfileOne from "./Component/UserProfileOne";
import UserProfileTwo from "./Component/UserProfileTwo";
import UserProfileThree from "./Component/UserProfileThree";
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import LeftArro from '../LeftArro';



const UserProfile = () => {

    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);
    const [showNavbar, setShowNavbar] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollUp = prevScrollPos > currentScrollPos;

            setPrevScrollPos(currentScrollPos);

            // Calculate scroll percentage
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (currentScrollPos / scrollHeight) * 100;

            // Define thresholds for showing and hiding navbar
            const hideThreshold = 0.5; // Hide navbar when scrolled down 10% or more
            const showThreshold = 0.1; // Show navbar when scrolled up 1% or more

            setShowNavbar(
                (scrollUp && scrollPercentage > showThreshold) || // Show on scroll up
                (!scrollUp && scrollPercentage < hideThreshold) || // Show on scroll down
                currentScrollPos === 0 // Always show at the top
            );
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);


    return (
        <>
        <LeftArro />
            <div className='userProfile-container w3-animate-opacity'>

                {/* {api.map((item) => {
                    if (currentUser.uid === item.uid) {
                        return (
                            <div key={item.id}>
                                <UserProfileOne user={item} />
                                <UserProfileTwo user={item} />
                            </div>
                        )
                    }
                })} */}
                <UserProfileThree />
                <div className='bottom-margin'></div>
            </div>
        </>
    )
}

export default UserProfile

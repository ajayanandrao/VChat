import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { auth, db } from '../../Firebase';
import { BsFillPeopleFill, BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { AuthContext } from '../../AuthContaxt';
import "./../../MobileNavbar/MobileNavebar.scss";
import { RxHamburgerMenu } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { MdAddReaction } from 'react-icons/md';
import v from "./../../Image/img/vl.png";

const Left = () => {

    const { currentUser } = useContext(AuthContext);
    const [theme, setTheme] = useState("light"); // Default theme
    const [dayTheme, setDayTheme] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Apply the selected theme to the document's root element
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const darkTheme = async () => {
        setDayTheme(!dayTheme);
        setTheme(theme === 'dark' ? "light" : "dark");

        // Update the user's theme preference in Firestore
        const themeRef = doc(db, 'Theme', currentUser && currentUser.uid);
        await setDoc(themeRef, {
            uid: currentUser.uid,
            theme: theme,
        });
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        // Update the theme preference in Firestore
        const userPreferencesRef = doc(db, 'UserPreferences', currentUser.uid);
        await setDoc(userPreferencesRef, { theme: newTheme });
    };

    useEffect(() => {
        // Retrieve user's theme preference from Firestore
        const userPreferencesRef = doc(db, 'UserPreferences', currentUser.uid);
        getDoc(userPreferencesRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userTheme = docSnap.data().theme;
                    setTheme(userTheme);
                }
            })
            .catch((error) => {
                console.error('Error retrieving user theme preference:', error);
            });
    }, [currentUser.uid]);

    return (
        <>

            <div className="left">
                <Link to="/home/" style={{ textDecoration: "none" }}>
                    <img src={v} className='logov-left-navbar' alt="" />
                </Link>

                <Link to="/createStory/" className="link">
                    <div className="story-left">
                        <MdAddReaction className='left-nav-icon dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>

                <Link to="/find_friend/" className="link">
                    <div className="story-left">
                        <BsFillPeopleFill className='left-nav-icon dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>

                <Link to="/search/" className="link ">
                    <div className="story-left left-search-icon left-search-icon">
                        <RiSearchLine className=' left-nav-icon dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>

                <div className="story-left" onClick={() => { darkTheme(); toggleTheme(); }}>
                    {theme === "dark" ?
                        <BsFillSunFill className="left-nav-icon mobile-nav-icon  dark:text-darkPostIcon" />
                        :
                        <BsMoonStarsFill className="left-nav-icon mobile-nav-icon text-lightPostIcon" />
                    }
                </div>

                <Link to="/option/" className="link">
                    <div className="story-left">
                        <RxHamburgerMenu className='left-nav-icon left-icon-transection dark:text-darkPostIcon text-lightPostIcon' />
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Left
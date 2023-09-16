import React, { useContext, useEffect, useState } from "react";
import "./MobileNavebar.scss";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiSearchLine } from "react-icons/ri";
import { AiFillHome } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { auth, db } from "../Firebase";
import { AuthContext } from "../AuthContaxt";
import { BsFillMoonStarsFill, BsFillPeopleFill, BsFillSunFill, BsMoonStarsFill } from "react-icons/bs";
import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { MdAddReaction, MdColorLens, MdMovieFilter } from "react-icons/md";
import v from "./../Image/img/vl.png";
import home from "./../Image/home2.png";
import heart from "./../Image/h3.png";
import video from "./../Image/v3.png";
// import p from "./../Image/img/3x.png";

const MobileNavebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [dayTheme, setDayTheme] = useState(false);
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        document.getElementById("navId").style.display = "flex";
        // document.getElementById("navIdB").style.display = "flex";
      } else {
        document.getElementById("navId").style.display = "none";
        // document.getElementById("navIdB").style.display = "none";
      }
    });
    return unsub;
  }, []);

  const [userPhoto, setUserPhoto] = useState(null);



  const dataRef = collection(db, "users");
  useEffect(() => {
    const unsub = onSnapshot(dataRef, (snapshot) => {
      setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Simulating an asynchronous operation with setTimeout
        setLoading(true);
        setTimeout(() => {
          const x = document.getElementById("navId");
          // const y = document.getElementById("navIdB");
          if (x.style.display == "none") {
            x.style.display = "flex";
            setLoading(false);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          const x = document.getElementById("navId");
          // const y = document.getElementById("navIdB");
          if (x.style.display || x.style.display == "flex") {
            x.style.display = "none";
            setLoading(false);
          }
        }, 1000);
      }
    });

    return () => {
      unsubscribe(); // Cleanup the subscription when the component unmounts
    };
  }, []);


  const themRef = collection(db, "Theme");
  const [activeThem, setActiveTheme] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(themRef, (snapshot) => {
      setActiveTheme(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsub;
  }, []);

  const [theme, setTheme] = useState("light");
  const [newTheme, setNewTheme] = useState(null);


  useEffect(() => {

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
    else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme])

  const darkTheme = async () => {
    setDayTheme(!dayTheme);
    setTheme(theme === 'dark' ? "light" : "dark");

    const themeRef = doc(db, 'Theme', currentUser && currentUser.uid);
    await setDoc(themeRef, {
      uid: currentUser.uid,
      theme: theme,
    })
  };



  return (
    <>
      <div
        className="mobile-nav-container bg-light_0 dark:bg-dark"
        style={{ display: "none" }}
        id="navId"
      >
        <Link to="home/" onClick={handleScrollToTop} style={{ textDecoration: "none" }}>
          {" "}
          <div className="mobile-nav-title">
            <img src={v} className="logo" alt="" />
          </div>
        </Link>

        <div className="mobile-item-div">



          <span className="mobile-nav-mainu">
            <Link to="createStory/" className="link">
              <div>
                <MdAddReaction className="mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon" />
                {/* <img src={currentUser.photoURL} className="top-navbar-story-profile-img" alt="" /> */}
              </div>
            </Link>
          </span>

          <span className="mobile-nav-mainu">
            <Link to="find_friend/" className="link">
              <div>
                <BsFillPeopleFill className="mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon" />
                {/* <img src={p} width={"18px"} alt="" /> */}
              </div>
            </Link>
          </span>

          <span className="mobile-nav-mainu">
            <Link to="search/" className="link">
              <div>
                <RiSearchLine className="mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon" />
              </div>
            </Link>
          </span>

          <div onClick={() => darkTheme()} className="mobile-nav-mainu">
            {dayTheme ?

              <BsFillSunFill className="mobile-nav-icon  dark:text-darkPostIcon" />
              :
              <BsMoonStarsFill className="mobile-nav-icon text-lightPostIcon" />
            }
          </div>

          {/* <div className="mobile-nav-mainu">
            <MdColorLens className="mobile-nav-icon text-lightPostIcon" />
          </div> */}

          <span className="mobile-nav-mainu">
            <Link to="option/" className="link">
              <RxHamburgerMenu className="mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon" />
            </Link>
          </span>
        </div>
      </div>

      {/* <div
        className="mobile-nav-bottom-container "
        style={{ display: "none" }}
        id="navIdB"
      >
        <Link to={"home/"}>
          <AiFillHome className='mobile-nav-bottom-icon' />
        </Link>
        <Link to="notification">
          <div>
            <AiFillHeart className="mobile-nav-bottom-icon" />
          </div>
        </Link>

        <Link to="message/">
          <div>
            <i className="bi bi-messenger"></i>
          </div>
        </Link>

        <Link to="reels">
          <div>
            <MdMovieFilter className="mobile-nav-bottom-icon" />
          </div>
        </Link>
        <Link to={"profile/"}>
          <div>
            <img
              src={currentUser && currentUser.photoURL}
              alt=""
              className="mobile-nav-bottom-photo"
            />
          </div>
        </Link>
      </div> */}
    </>
  );
};

export default MobileNavebar;

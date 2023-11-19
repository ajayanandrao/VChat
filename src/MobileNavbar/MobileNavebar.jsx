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
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { MdAddReaction, MdColorLens, MdMovieFilter } from "react-icons/md";
import v from "./../Image/img/vl.png";
import { FaMoon } from "react-icons/fa";
import { BiSolidSun } from "react-icons/bi";
import { SiHelpscout } from "react-icons/si";


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
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const darkTheme = async () => {
    setDayTheme(!dayTheme);
    setTheme(theme === 'dark' ? "light" : "dark");
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Update the theme preference in Firestore
    const userPreferencesRef = doc(db, 'UserPreferences', currentUser.uid);
    await setDoc(userPreferencesRef, { theme: newTheme });
  };



  const [themIcon, setThemIcon] = useState([]);
  useEffect(() => {
    const colRef = collection(db, 'UserPreferences');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setThemIcon(newApi);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
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

  const [isActive, setIsActive] = useState(false);
  const toggleHeart = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div
        className="mobile-nav-container bg-light_0 dark:bg-dark"
        style={{ display: "none" }}
        id="navId"
      >

        <Link to="home/" className="mobile-nav-title" onClick={handleScrollToTop} style={{ textDecoration: "none" }}>
          <div className="mobile-nav-title">
            <div>
              <img src={v} className="nav-logo" alt="" />
            </div>
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

          <span className="mobile-nav-mainu">
            <Link to="reels/" className="link">
              <div>
                <MdMovieFilter className="mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon" />
                {/* <i className="bi bi-image-fill mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon"></i> */}
              </div>
            </Link>
          </span>

          <div onClick={() => { darkTheme(); toggleTheme(); }} className="mobile-nav-mainu">

            <div className="mobile-nav-icon">
              {themIcon.map((item) => {
                if (item.id === currentUser.uid) {
                  return (
                    <div key={item.id}>
                      <div className=""> {item.theme === "dark" ?
                        <BiSolidSun style={{ fontSize: "30px" }} className="mobile-nav-icon  dark:text-darkPostIcon" />
                        :
                        <FaMoon className="mobile-nav-icon text-lightPostIcon" />
                      }</div>
                    </div>
                  )
                }
              })}
            </div>

          </div>


          <span className="mobile-nav-mainu">
            <Link to="option/" className="link">
              <RxHamburgerMenu className="mobile-nav-icon text-lightPostIcon dark:text-darkPostIcon" />
            </Link>
          </span>
        </div>
        <div className="color-line dark:bg-gradient-dark"></div>
      </div >

    </>
  );
};

export default MobileNavebar;

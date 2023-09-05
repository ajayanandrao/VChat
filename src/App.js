import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollTop';
import Login from './Authentication/Login';
import SignUp from './Authentication/SignUp';
import ChangePassword from './Authentication/ChangePassword';
import ForgotPassword from './Authentication/ForgotPassword';
import Home from './Home/Home';
import Post from './Post/Post';
import NotificationProps from './Notification/NotificationProps';
import NotificationPara from './Notification/NotificationPara';
import Option from './Option/Option';
import Setting from './Setting/Setting';
import Policy from './Setting/policy/Policy';
import SearchUser from './Search/SearchUser';
import Message from './Message/Message';
import PeopleProps from './People/PeopleProps';
import WeddingMain from './Wedding/WeddingMain';
import WeddingList from './Wedding/WeddingList';
import Wedding from './Wedding/Wedding';
import WeddingListDetail from './Wedding/WeddingListDetail';
import Users from './Params/Users';
import UsersDetails from './Params/UsersDetails';
import UsersProfilePage from './Params/UsersProfilePage';
import UserProfile from './UserProfile/UserProfile';
import ReelsProps from './Reals/ReelsProps';

import Messages from './Message/Messages/Messages';
import MobileNavebar from './MobileNavbar/MobileNavebar';
import CurrentUserProfileMain from './CurrentUserProfile/CurrentUserProfileMain';
import OtherUserProfileMain from './OtherUserProfile/OtherUserProfileMain';
import CurrentUserFriendProfileMain from './CurrentUserFriendProfile/CurrentUserFriendProfileMain';
import { useEffect, useState } from 'react';
import MobileNavbarBottom from './MobileNavbar/MobileNavbarBottom';
import { auth } from './Firebase';
import BottomNav from './MobileNavbar/BottomNav';
import Navbar from './Navbar/Navbar';

function App() {

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
      setButtonPosition(scrollUp ? 0 : -80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);


  const style = {
    position: "sticky",
    top: `${0 + buttonPosition}px`, // Adjusted position
    zIndex: "9999",
    cursor: "pointer",
    transition: "top 0.5s ease-in-out" // Smooth animation
  }


  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Simulating an asynchronous operation with setTimeout
        setTimeout(() => {
          setLoading(true);
        });
      } else {
        setTimeout(() => {
          setLoading(false);
        });
      }
    });

    return () => {
      unsubscribe(); // Cleanup the subscription when the component unmounts
    };
  }, []);

  return (
    <>
      <Router basename='/VChat'>
        {/* <div className="mobile">
          <div className={`mobile-navbar ${showNavbar ? '' : 'hidden'}`}>  </div>
        </div> */}

        {loading ?
          (<>
            <div className="mobile" style={style}>
              <MobileNavebar />
            </div>

            <Navbar />
            <ScrollToTop /> </>)
          :
          ""
        }
        <Routes >
          <Route exact path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />

          {loading ?

            (<> <Route path="home" element={<Home />} />
              <Route path="post" element={<Post />} />

              <Route path='notification' element={<NotificationProps />} />
              <Route path='notification/:id' element={<NotificationPara />} />

              <Route exact path="changePassword" element={<ChangePassword />} />
              <Route exact path="forgotPassword" element={<ForgotPassword />} />

              {/* <Route path="option" element={<Option />} /> */}
              <Route path="option" element={<Option />} />
              <Route path="setting" element={<Setting />} />
              <Route path="policy" element={<Policy />} />
              <Route path="search" element={<SearchUser />} />
              <Route path="message" element={<Message />} />
              <Route path="find_friend" element={<PeopleProps />} />

              <Route path="Wedding" element={<WeddingMain />} />
              <Route path="WeddingList" element={<WeddingList />} />
              <Route path="AddWedding" element={<Wedding />} />
              <Route path="WeddingList/:id" element={<WeddingListDetail />} />

              <Route path='users' element={<Users />} />

              <Route path='users/:id' element={<OtherUserProfileMain />} />
              <Route path='users/:id/message' element={<Messages />} />

              <Route path='users/:id/:userId/profile' element={<CurrentUserFriendProfileMain />} />

              <Route path='profile' element={<CurrentUserProfileMain />} />

              <Route path='/reels/' element={<ReelsProps />} /> /
              <Route path='notification' element={<NotificationProps />} />
              <Route path='notification/:id' element={<NotificationPara />} /></>)
            :
            null
          }
        </Routes>
      </Router>
    </>
  );
}

export default App;

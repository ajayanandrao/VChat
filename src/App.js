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

function App() {

  const [showNavbar, setShowNavbar] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollUp = prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setShowNavbar(scrollUp || currentScrollPos === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <>
      <Router basename='/VChat'>

         <div className={`mobile-navbar ${showNavbar ? '' : 'hidden'}`}> <MobileNavebar /> </div>
        
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />

          <Route path="home" element={<Home />} />
          <Route path="post" element={<Post />} />

          <Route path='notification' element={<NotificationProps />} />
          <Route path='notification/:id' element={<NotificationPara />} />

          <Route exact path="changePassword" element={<ChangePassword />} />
          <Route exact path="forgotPassword" element={<ForgotPassword />} />

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

          <Route path='reels' element={<ReelsProps />} />/
          <Route path='notification' element={<NotificationProps />} />
          <Route path='notification/:id' element={<NotificationPara />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;

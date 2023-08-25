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

function App() {
  return (
    <>
      <Router basename='/VChat'>
        <MobileNavebar />
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
          <Route path='users/:id' element={<UsersDetails />} />
          <Route path='users/:id/message' element={<Messages />} />
          <Route path='users/:id/:userId/profile' element={<UsersProfilePage />} />

          <Route path='profile' element={<UserProfile />} />
          {/* <Route path='demo' element={<Demo />} /> */}
          {/* <Route path='movies' element={<Movies />} />
          <Route path='movie/:id' element={<AddHollywood />} />
          <Route path='requestMovie' element={<RequestMovie />} />

          <Route path='hollywoodmovie/:id' element={<HollywoodMovies />} />
          <Route path='bollywoodmovie/:id' element={<BollywoodMovies />} />
          <Route path='cartoonMovie/:id' element={<CartoonMovies />} />
          <Route path='latestMovie/:id' element={<LatestMovies />} />

          <Route path='hollywood' element={<Hollywood />} />
          <Route path='bollywood' element={<Bollywood />} />
          <Route path='cartoon' element={<Cartoon />} /> */}

          <Route path='reels' element={<ReelsProps />} />/
          <Route path='notification' element={<NotificationProps />} />
          <Route path='notification/:id' element={<NotificationPara />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;

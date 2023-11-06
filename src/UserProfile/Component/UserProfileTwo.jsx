import React, { useContext, useEffect, useState } from 'react';
import "./UserProfileTwo.scss";
import { AuthContext } from "./../../AuthContaxt";
import { HiPencil } from "react-icons/hi";
import { MdClose } from 'react-icons/md';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../../Firebase';
import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import { useCollectionData } from 'react-firebase-hooks/firestore';



const ProfileTwo = ({ user }) => {
    const { currentUser } = useContext(AuthContext);


    const [userDataId, setUserDataId] = useState([]);
    const [api, setApi] = useState([]);

    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApi(newApi);
        });

        return unsubscribe;
    }, []);


    useEffect(() => {
        // Extract uid values from the api array
        const uidArray = api.map(userData => userData.uid);

        // Update the userDataId state with the uidArray
        setUserDataId(uidArray);
    }, [api]);


    const [overlay, setOverlay] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');


    const handleDisplayNameUpdate = async () => {
        setNewDisplayName('');
        setLoading(true);
        if (newDisplayName && currentUser) {
            try {
                const auth = getAuth(); // Get the authentication instance

                // Update the user's profile display name
                await updateProfile(auth.currentUser, {
                    displayName: newDisplayName
                });

                // Update the name of users collection 

                const userRef = doc(db, 'users', user.id);
                await updateDoc(userRef, { name: newDisplayName });

                const updateProfileRef = doc(db, 'UpdateProfile', user.uid);
                await updateDoc(updateProfileRef, { name: newDisplayName });

                // update a presenceName in OnlyOnline collection

                const OnlineRef = doc(db, 'OnlyOnline', user.uid);
                await updateDoc(OnlineRef, { presenceName: newDisplayName });

                // Update the display name in all the user's posts
                const postsRef = collection(db, 'AllPosts');

                const userPostsQuery = query(postsRef, where('uid', '==', currentUser.uid));
                const userPostsSnapshot = await getDocs(userPostsQuery);

                const batch = writeBatch(db);
                userPostsSnapshot.forEach((postDoc) => {
                    const postRef = doc(db, 'AllPosts', postDoc.id);
                    batch.update(postRef, { displayName: newDisplayName });
                });

                await batch.commit();
                setNewDisplayName('');
                setLoading(false);
            } catch (error) {
                // Handle error here
                console.error("Error updating display name:", error);
                console.log(error.message);
                setLoading(false);
            }
        }
        setOverlay(false);

    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., form submission)
            handleDisplayNameUpdate();
        }
    };

    const [apiData, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');

        // Add a delay of 1000 milliseconds (1 second)
        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setApiData(newApi);
            });

            return () => {
                // Cleanup the subscription when the component unmounts
                unsubscribe();
            };
        }, 1000);

        // Clear the delay if the component unmounts before the delay completes
        return () => clearTimeout(delay);
    }, []);

    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const friendsRef = collection(db, `allFriends/${currentUser && currentUser.uid}/Friends`);
        const unsubscribe = onSnapshot(friendsRef, (friendsSnapshot) => {
            const friendsData = friendsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFriendsList(friendsData);
        }, (error) => {
            console.error('Error fetching friends:', error);
        });

        return () => unsubscribe();
    }, [currentUser && currentUser]);

    const colRef = collection(db, 'AllPosts');
    const q = query(colRef, orderBy('bytime', 'desc'));
    const [docs, error] = useCollectionData(q, orderBy('bytime', 'desc'));
    const [postData, setPostData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setPostData(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const userPosts = postData.filter(post => post.uid === currentUser.uid);
    const userPostCount = userPosts.length;

    console.log(`The current user has ${userPostCount} posts.`);
    return (
        <>
            {overlay ? (
                <div id='update-name-overlay-div'>

                    <MdClose className='update-name-overlay-close dark:text-[white] text-darkDiv' onClick={() => setOverlay(false)} />

                    <div className="update-name-ovelay-center">
                        <div className='update-name-overlay-input-div'>
                            <div className='update-overlay-img-div'>
                                <img src={currentUser.photoURL} className='update-overlay-img' alt="" />
                            </div>
                            <input
                                type="text"
                                placeholder='Name'
                                className='update-name-overlay-Input bg-lightDiv text-lightProfileName dark:bg-darkDiv dark:text-darkProfileName'
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />


                            <div className="btn-success-custom" style={{ borderRadius: "30px" }} onClick={handleDisplayNameUpdate}>
                                {loading ? (<>
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </>) : "Save"}
                            </div>

                        </div>
                    </div>
                </div>
            ) : ""}
            <div className="profile-name-container ">

                <div className='d-flex align-items-center'>
                    <h3 className='profile-name-text text-2xl text-lightProfileName dark:text-darkProfileName'>{currentUser && currentUser.displayName}</h3>
                    <div className="profile-Edit-btn bg-lightDiv dark:bg-darkPostIcon">
                        <HiPencil className='edit-pencil text-lightPostText dark:text-darkDiv' onClick={() => setOverlay(!overlay)} />
                    </div>
                </div>

                <div className="profile-friend-count text-lightPostIcon dark:text-darkPostTime">
                    <span style={{ fontWeight: "600" }}> {friendsList.length} Friends</span>
                </div>
            </div>
        </>
    )
}

export default ProfileTwo;

import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import "./Friends.scss";
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';



const Friends = ({ user }) => {
    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");

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


    // const deleteFriend = async (id, uid) => {
    //     const CurrentFriendRef = collection(db, `allFriends/${currentUser.uid}/Friends`);
    //     console.log(id);
    //     console.log(uid);
    //     try {
    //         const CurrentUserDoc = await getDoc(doc(CurrentFriendRef, id));

    //         if (CurrentUserDoc.exists()) {
    //             await deleteDoc(doc(CurrentFriendRef, id));
    //             console.log('Friend deleted successfully');
    //         } else {
    //             console.log('Friend not found');
    //         }

    //     } catch (error) {
    //         console.error('Error deleting friend:', error);
    //     }

    //     // ==========================================================

    //     const friendsRef = collection(db, `allFriends/${uid}/Friends`);
    //     const friendsQuery = query(friendsRef, where('userId', '==', currentUser.uid));

    //     try {
    //         const querySnapshot = await getDocs(friendsQuery);

    //         querySnapshot.forEach(async (doc) => {
    //             console.log('Found user ID:', doc.data().userId);

    //             try {
    //                 await deleteDoc(doc.ref); // Use doc.ref to get the document reference
    //                 console.log('Friend deleted successfully');
    //             } catch (deleteError) {
    //                 console.error('Error deleting friend:', deleteError);
    //             }
    //             if (querySnapshot.size === 0) {
    //                 console.log('Friend not found');
    //             }

    //         });
    //     } catch (error) {
    //         console.error('Error getting documents:', error);
    //     }
    // };



    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);


    return (
        <>

            <h2 className='text-3xl text-lightPostText dark:text-darkPostText mb-3'>Friends</h2>

            <input type="text"
                placeholder='Serch friends'
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className='friend-search bg-lightDiv text-lightProfileName dark:bg-darkDiv dark:text-darkPostText' />

            <div className="Friend-grid-parent-container">
                <div className='friend-container'>
                    {api.filter((value) => {
                        if (search === "") {
                            return value;
                        } else if (
                            value.name.toLowerCase().includes(search.toLowerCase())
                        ) {
                            return value;
                        }
                    }).map((item) => {
                        return (
                            <>
                                {friendsList

                                    .map((friend) => {

                                        if (item.uid === friend.uid) {
                                            return (
                                                <div key={friend.userId} >

                                                    <Link style={{ textDecoration: "none" }} to={`/users/${friend.userId}/${friend.id}/profile/`}>
                                                        <div>
                                                            <img src={item.PhotoUrl} className='friend-img' alt="" />
                                                            <div className='friend-name text-lightProfileName dark:text-darkProfileName'>{item.name}</div>
                                                            {/* <button onClick={() => deleteFriend(friend.id, friend.uid)} className='btn btn-info'>Delete</button> */}
                                                        </div>
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    })}


                            </>
                        )
                    })}

                </div>
            </div>
        </>
    )
}

export default Friends 

import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../AuthContaxt';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { Link } from 'react-router-dom';


const ProfileFriends = ({ user }) => {

    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");

    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(collection(db, `allFriends/${user.uid}/Friends`));
                const friendsSnapshot = await getDocs(friendsQuery);
                const friendsData = friendsSnapshot.docs.map(doc => doc.data());
                setFriendsList(friendsData);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);

    const [api, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const delay = setTimeout(() => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setApiData(newApi);
                setLoading(false);
            });

            return () => {
                // Cleanup the subscription when the component unmounts
                unsubscribe();
            };
        }, 1000);

        // Clear the delay if the component unmounts before the delay completes
        return () => clearTimeout(delay);
    }, []);

    return (
        <div>
            <div className='friend-search-div'>
                <h2 className='text-3xl text-lightPostText dark:text-darkPostText mb-3'>Friends</h2>

                <input type="text"
                    placeholder='Serch friends '
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className='friend-search bg-lightDiv text-lightProfileName dark:bg-darkDiv dark:text-darkPostText' />
            </div>

            {loading ? (<>
                <div className="friend-container-loading-div">
                    <div className="friend-container-loading">
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                        <div className='placeholder-glow friend-while-loading-div-outer '>
                            <div className='friend-while-loading-div placeholder bg-[white] dark:bg-darkPostIcon'></div>
                        </div>
                    </div>
                </div>
            </>)
                :
                (<>
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
                                if (item.uid !== currentUser.uid) {
                                    return (
                                        <>
                                            {friendsList

                                                .map((friend) => {

                                                    if (item.uid === friend.uid) {
                                                        return (
                                                            <div key={friend.userId} >

                                                                <Link style={{ textDecoration: "none" }} to={`/users/${friend.userId}`}>
                                                                    <div className='w-100' style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
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

                                }
                            })}

                        </div>
                    </div>
                </>)}


        </div>
    )
}

export default ProfileFriends

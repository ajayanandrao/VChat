import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../Firebase';
import { Link } from 'react-router-dom';

const UserFriendPage = ({ user }) => {

    const [search, setSearch] = useState("");
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        const friendsRef = collection(db, `allFriends/${user && user.uid}/Friends`);
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
    }, [user.uid]);

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

        return () => clearTimeout(delay);
    }, []);

    const newarrytwo = api.filter((item) =>
        friendsList.some((friend) => item.uid === friend.uid)
    );

    const filteredArray = newarrytwo.filter((value) => {
        if (search === "") {
            return true; // Include all elements if search is empty
        } else if (value.name.toLowerCase().includes(search.toLowerCase())) {
            return true; // Include elements that match the search condition
        } else {
            return false; // Exclude elements that don't match the search condition
        }
    });

    return (
        <div>
            {/* sdfsdfsdfsdfsdf */}

            <div className="friend-search-div">
                <h2 className='text-3xl text-lightPostText dark:text-darkPostText mb-3'>Friends</h2>

                <input type="text"
                    placeholder='Serch friends '
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className='friend-search bg-lightDiv text-lightProfileName dark:bg-darkDiv dark:text-darkPostText' />
            </div>
            {friendsList.length === 0 ? (

                <div className='no-post-div text-4xl text-center text-lightProfileName dark:text-darkProfileName'>
                    No Friend to Display
                </div>

            ) : (

                <>


                    <div>
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

                                        {search == "" ?
                                            (<>
                                                {newarrytwo.map((friend) => {
                                                    return (
                                                        <div key={friend.uid} >

                                                            <div className='w-100' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                <img src={friend.PhotoUrl} className='friend-img' alt="" />
                                                                <div className='friend-name text-lightProfileName dark:text-darkProfileName'>{friend.name}</div>
                                                            </div>

                                                        </div>
                                                    )
                                                })}
                                            </>)
                                            :
                                            (<>
                                                {filteredArray.map((friend) => {
                                                    return (
                                                        <div key={friend.uid} >

                                                            <div className='w-100' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                <img src={friend.PhotoUrl} className='friend-img' alt="" />
                                                                <div className='friend-name text-lightProfileName dark:text-darkProfileName'>{friend.name}</div>
                                                            </div>

                                                        </div>
                                                    )
                                                })}
                                            </>)
                                        }




                                    </div>
                                </div>
                            </>)
                        }
                    </div>

                </>

            )
            }


        </div>
    )
}

export default UserFriendPage
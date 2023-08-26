import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../Firebase';
import { Link } from 'react-router-dom';

const UserFriendPage = ({ user }) => {

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
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    return (
        <div>

            {friendsList.length === 0 ? (

                <h5>
                    No Friend to Display
                </h5>

            ) : (

                <>
                    <div className="Friend-grid-parent-container">
                        <div className='friend-container'>
                            {api.map((item) => {
                                return (
                                    <>
                                        {friendsList.map((friend) => {

                                            if (item.uid === friend.uid) {
                                                return (
                                                    <div key={friend.userId} >


                                                        <div>
                                                            <img src={item.PhotoUrl} className='friend-img' alt="" />
                                                            <div className='friend-name'>{item.name}</div>
                                                        </div>

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


        </div>
    )
}

export default UserFriendPage
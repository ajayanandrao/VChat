import React, { useContext, useEffect, useState } from 'react'
import "./CurrentUserFriendProfileMain.scss";

import ProfilePageOne from './../Params/UserProfilePages/ProfilePageOne';

import { CircularProgress } from '@mui/material';
import ProfilePageTwo from '../Params/UserProfilePages/ProfilePageTwo';
import ProfilePageThree from '../Params/UserProfilePages/ProfilePageThree';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useParams } from 'react-router-dom';
import LeftArro from '../LeftArro';
import { AuthContext } from '../AuthContaxt';
import Audio from '../Audio';




const CurrentUserFriendProfileMain = () => {
    const { currentUser } = useContext(AuthContext);
    const { id, userId } = useParams(); // Assuming id is friend.userId and uid is friend.id
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'UpdateProfile', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUser({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // Simulate a delay of 2 seconds (you can adjust the delay as needed)
                setTimeout(async () => {
                    const friendsQuery = query(
                        collection(db, `allFriends/${currentUser.uid}/Message`),
                        orderBy('time', 'asc') // Reverse the order to show newest messages first
                    );

                    const unsubscribe = onSnapshot(friendsQuery, (friendsSnapshot) => {
                        const friendsData = friendsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        // Reverse the order of messages to show newest messages first
                        setMessages(friendsData.reverse());
                    });

                    // Return the unsubscribe function to stop listening to updates when the component unmounts
                    return () => unsubscribe();
                }, 1000); // Delay for 2 seconds (2000 milliseconds)
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                // Query all documents in the specific collection
                const messageCollection = collection(db, `allFriends/${currentUser.uid}/Message`);
                const querySnapshot = await getDocs(messageCollection);

                // Iterate through the documents and update each one to set the "sound" field to null
                querySnapshot.forEach(async (doc) => {
                    const docRef = doc.ref;
                    // console.log(docRef);
                    await updateDoc(docRef, {
                        sound: "off"
                    });
                });

                // console.log('The "sound" field in all documents of the specified collection has been set to null.');
            } catch (error) {
                console.error('Error updating "sound" field:', error);
            }
        }, 1000); // 5 seconds

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    });


    if (!user) {
        return <>
            <div className='skeleton-center bg-light_0 dark:bg-dark'>
                <CircularProgress className='circularprogress' />
            </div>
        </>;
    }
    return (
        <>
            <LeftArro />
            {messages.slice(0, 1).map((sms) => {
                return (
                    <div key={sms.id}>
                        {sms.sound === "on" ? <Audio /> : null}
                    </div>
                );
            })}


            <div className='current-user-friend-profile-main bg-light_0 dark:bg-dark'>
                <div className="left-div"></div>
                <div className='current-user-friend-inner-div'>
                    <ProfilePageOne user={user} />
                    <ProfilePageTwo user={user} userId={userId} />
                    <ProfilePageThree user={user} />
                </div>
            </div>
        </>
    )
}

export default CurrentUserFriendProfileMain
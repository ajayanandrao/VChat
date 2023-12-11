import React, { useContext, useEffect, useState } from 'react'
import "./../UserProfile/UserProfile.scss";
import "./CurrentUserProfileMain.scss";

import UserProfileOne from "./../UserProfile/Component/UserProfileOne";

import UserProfileTwo from "./../UserProfile/Component/UserProfileTwo";

import UserProfileThree from "./../UserProfile/Component/UserProfileThree";

import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import LeftArro from '../LeftArro';
import Audio from '../Audio';



const CurrentUserProfileMain = () => {

    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

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

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await deleteDoc(PresenceRefOnline);
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

    return (
        <div className='current-user-profile-main bg-light_0 dark:bg-dark'>
            <div className="left-div"></div>
            <div className='current-user-profile-container'>
                <LeftArro />
                {api.map((item) => {
                    if (currentUser.uid === item.uid) {
                        return (
                            <div key={item.id}>
                                <UserProfileOne user={item} />
                                <UserProfileTwo user={item} />
                            </div>
                        )
                    }
                })}
                <UserProfileThree />

                {messages.slice(0, 1).map((sms) => {
                    return (
                        <div key={sms.id}>
                            {sms.sound === "on" ? <Audio /> : null}
                        </div>
                    );
                })}

            </div>
        </div>
    )
}

export default CurrentUserProfileMain
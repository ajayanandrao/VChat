import React from 'react'
import "./Wedding.scss";
import { Link, useNavigate } from 'react-router-dom';
import WeddingList from './WeddingList';
import { PiPlusBold } from 'react-icons/';
import { BiUpArrowAlt } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import LeftArro from '../LeftArro';
import { collection, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../AuthContaxt';
import Audio from '../Audio';


const WeddingMain = () => {
    const { currentUser } = useContext(AuthContext);
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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

    return (
        <div className='wedding-main-container bg-light_0 text-lightProfileName dark:bg-dark wedding-main-div' >
            {messages.slice(0, 1).map((sms) => {
                return (
                    <div key={sms.id}>
                        {sms.sound === "on" ? <Audio /> : null}
                    </div>
                );
            })}

            <LeftArro />
            <WeddingList />
            <Link to={"/AddWedding/"}>
                <div className='w-create-bio-btn'>
                    <FaPlus style={{ fontSize: "18px" }} />
                </div>
            </Link>
            {/* <div className='w-up-bio-btn text-aqua_0 dark:text-aqua_0' style={{color:'#06b6d4'}} onClick={handleScrollToTop}>
                <BiUpArrowAlt />
            </div> */}
        </div>
    )
}

export default WeddingMain

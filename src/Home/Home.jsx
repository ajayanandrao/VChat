import React, { useEffect, useState } from 'react'
import "./Home.scss";
import { auth, db } from '../Firebase';
import HomePage from './HomePage';
import { collection, onSnapshot } from 'firebase/firestore';
// import StoryForm from '../Story/StoryForm';

const Home = () => {

    const [loading, setLoading] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Simulating an asynchronous operation with setTimeout
                setTimeout(() => {
                    setLoading(true);
                });
            } else {
                setTimeout(() => {
                    setLoading(false);
                });
            }
        });

        return () => {
            unsubscribe(); // Cleanup the subscription when the component unmounts
        };
    }, []);


    return (
        <>
            {loading &&
                <HomePage />
            }
        </>
    )
}

export default Home

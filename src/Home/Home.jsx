import React, { useContext, useEffect, useState } from 'react'
import "./Home.scss";
import Post from '../Post/Post';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import { auth, db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FlipMove from 'react-flip-move';
import { AiOutlineArrowUp } from "react-icons/ai";
import { CircularProgress } from '@mui/material';
import Feed from '../Feed/Feed';
import { motion, useAnimation } from 'framer-motion';
import UserMedia from '../UserProfile/Tab/UserMedia';
import Wellcome from './Wellcome';
import StoryForm from '../Story/StoryForm';
import HomePage from './HomePage';
// import StoryForm from '../Story/StoryForm';

const Home = () => {

    const [userPhoto, setUserPhoto] = useState(null);
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

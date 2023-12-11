import React, { useContext, useEffect, useState } from 'react'
import "./Install.scss";
import LeftArro from '../../LeftArro';
import mone from "./../../Image/mobile4.png";
import mtwo from "./../../Image/mobile2.png";
import audio from "./../../Image/install.mp3";
import { AuthContext } from '../../AuthContaxt';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';

const Install = () => {

    const { currentUser } = useContext(AuthContext);

    const [isPlaying, setIsPlaying] = useState(true);
    const audioURL = audio;

    useEffect(() => {
        const audioElement = document.getElementById('audio-element');

        if (isPlaying) {
            audioElement.play();
            setTimeout(() => {
                setIsPlaying(false); // Stop playing after 20 seconds
            }, 17000); // 20 seconds in milliseconds
        } else {
            audioElement.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await updateDoc(PresenceRefOnline, {
                    status: 'Offline',
                    presenceTime: new Date(),
                    timestamp: serverTimestamp()
                });
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
        <div className='bg-lightDiv dark:bg-darkDiv install-vchat-container'>
            <div>
                <audio id="audio-element" src={audioURL} autoPlay={isPlaying}></audio>

            </div>

            {isPlaying ? (
                <div className='install-audio text-lightPostText dark:text-aqua_0'>
                    <i class="bi bi-volume-up"></i>
                </div>
            ) : null}


            <LeftArro />
            <div className='install-app-div  text-lightProfileName dark:text-darkProfileName '>Install VChat App</div>

            <div className='install-app-main-container'>

                <div className='install-item-one mb-3 text-lightProfileName dark:text-darkProfileName'>first of all, You need to log in to your Account.</div>
                <img src={mone} alt="" className='install-item-img' />
                <div className='install-item-one my-3 text-lightProfileName dark:text-darkProfileName'>And then click the Option button at the top right corner. find "Install app" option and click on it.</div>
                <img src={mtwo} alt="" className='install-item-img'/>
                <div className='install-item-one my-4 text-lightProfileName dark:text-darkProfileName'>VChat App will install in a couple of seconds.</div>


            </div>

        </div>
    )
}

export default Install
import React, { useContext, useEffect, useRef, useState } from 'react';
import smsSound from './Image/iphone.mp3';
import { AuthContext } from './AuthContaxt';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';

const Audio = () => {
    const audioRef = useRef(null); // Create a ref for the audio element
    const { currentUser } = useContext(AuthContext);
    return (
        <div>
            <audio
                autoPlay
                onError={(e) => console.error("Audio Error:", e)}
                ref={audioRef} // Attach the ref to the audio element
            >
                <source src={smsSound} type="audio/mpeg" />

            </audio>

        </div>
    );
}

export default Audio;

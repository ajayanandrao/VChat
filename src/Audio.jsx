import React, { useEffect, useRef, useState } from 'react';
import smsSound from './Image/iphone.mp3';

const Audio = ({ latestMessage }) => {
    const audioRef = useRef(null); // Create a ref for the audio element

    // useEffect(() => {
    //     const audioElement = audioRef.current;

    //     // Function to handle window blur
    //     const handleWindowBlur = () => {
    //         if (audioElement && !audioElement.paused) {
    //             audioElement.pause();
    //         }
    //     };

    //     window.addEventListener('blur', handleWindowBlur);

    //     return () => {
    //         window.removeEventListener('blur', handleWindowBlur);
    //     };
    // }, []);

    // function formatTimestampMessage(timestamp) {
    //     const date = timestamp.toDate();
    //     const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    //     return date.toLocaleString('en-US', options);
    // }

    // function formatTimestamp(timestamp) {
    //     const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    //     return timestamp.toLocaleString('en-US', options);
    // }

    // const currentDateAndTime = new Date();
    // currentDateAndTime.setSeconds(currentDateAndTime.getSeconds() - 30);

    // const formattedCurrentDateAndTime = formatTimestamp(currentDateAndTime);

    // const [display, setDisplay] = useState(false);

    // useEffect(() => {
    //     const sub = () => {
    //         console.log("ajay anandrao")
    //         if (formatTimestamp(formattedCurrentDateAndTime) < formatTimestampMessage(latestMessage.time)) {
    //             console.log("okk");
    //             setDisplay(true);

    //         } else {
    //             console.log("not okk");
    //             setDisplay(false);
    //         }
    //     }
    //     return sub();
    // }, [])

    return (
        <div>
            <audio
                autoPlay
                onError={(e) => console.error("Audio Error:", e)}
                ref={audioRef} // Attach the ref to the audio element
            >
                <source src={smsSound} type="audio/mpeg" />
            </audio>

            {/* {display ? (<>

                <div className="message-content">
                </div>

                <div className='me-4' id='t'> {formatTimestamp(formattedCurrentDateAndTime)}</div>
            </>)
                :
                null
            } */}



        </div>
    );
}

export default Audio;

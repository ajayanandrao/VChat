import React from 'react'
import "./RealTime.scss";
import { realdb } from '../Firebase';
import { onDisconnect, onValue, ref, remove, set, update } from 'firebase/database';
import { useState } from 'react';


const RealTime = () => {

    const [name, setName] = useState("");
    const presenceRef = ref(realdb, "disconnectmessage");
    // onDisconnect(presenceRef).set("I disconnected!");
    const submit = () => {
        const presenceRef = ref(realdb, "disconnectmessage");
        onDisconnect(presenceRef).update({ isOnline: false });
        onDisconnect(presenceRef, () => {
            set(presenceRef, {
                name: "I disconnected!"
            }).then(() => {
                console.log("Disconnected and data set successfully!");
            }).catch((error) => {
                console.error("Error setting data on disconnection:", error);
            });
        });
    };

    const connectedRef = ref(realdb, ".info/connected");
    onValue(connectedRef, (snap) => {
        if (snap.val() === false) {
            console.log("connected");
        } else {
            console.log("not connected");
        }
    });

    const Remove = () => {
        const presenceRef = ref(realdb, "disconnectmessage");
        onDisconnect(presenceRef, () => {
            remove(presenceRef).catch((err) => {
                console.error("Could not remove data on disconnection", err);
            });
        });
    };

    return (

        <div className='d-flex'>
            <div className="left"></div>
            <div className='p-4 tdiv bg-light_0 dark:bg-dark text-lightProfileName dark:text-darkProfileName'>
                <input type="text" placeholder='enter name' onChange={(e) => setName(e.target.value)} />
                <button className='m-4 btn btn-primary' onClick={submit}>ok</button>
                <button className='m-4 btn btn-info btn-sm' onClick={Remove}>remove</button>
            </div>
        </div>
    )
}

export default RealTime
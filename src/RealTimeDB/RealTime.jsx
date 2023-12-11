import React, { useEffect } from 'react'
import "./RealTime.scss";
import { realdb } from '../Firebase';
import { onDisconnect, onValue, ref, remove, set, update, serverTimestamp, push } from 'firebase/database';
import { useState } from 'react';
import { AuthContext } from '../AuthContaxt';
import { useContext } from 'react';


const RealTime = () => {
    const { currentUser } = useContext(AuthContext);
    const [name, setName] = useState("");
    const submit = () => {
        const presenceRef = ref(realdb, `OnlineStatus/${currentUser.uid}`);

        set(presenceRef, {
            status: "online",
            uid: currentUser.uid,
            name: currentUser.displayName,
            photoUrl: currentUser.photoURL,
            timestamp: serverTimestamp()
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

    const Remove = (id) => {
        const presenceRef = ref(realdb, "OnlineStatus", id);
        update(presenceRef, {
            status: "offline",
            uid: currentUser && currentUser.uid,
            name: currentUser.displayName,
            photoUrl: currentUser.photoURL,
            timestamp: serverTimestamp()
        })
    };

    const handleUpdateStatus = (id) => {
        const presenceRef = ref(realdb, `OnlineStatus/${currentUser.uid}`);

        update(presenceRef, {
            status: "offline",
            uid: currentUser.uid,
            name: currentUser.displayName,
            photoUrl: currentUser.photoURL,
            timestamp: serverTimestamp()
        });
    };

    const [onlineStatus, setOnlineStatus] = useState([]);
    useEffect(() => {
        const presenceRef = ref(realdb, 'OnlineStatus/');

        // Listen for changes in the database
        const unsubscribe = onValue(presenceRef, (snapshot) => {
            const data = snapshot.val();

            // Convert the data object to an array of objects
            const onlineStatusArray = data
                ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
                : [];

            setOnlineStatus(onlineStatusArray);
        });

        // Cleanup the listener when the component is unmounted
        return () => {
            unsubscribe();
        };
    }, []);

    return (

        <div className='d-flex'>
            <div className="left"></div>
            <div className='p-4 tdiv bg-light_0 dark:bg-dark text-lightProfileName dark:text-darkProfileName'>
                <input type="text" placeholder='enter name' onChange={(e) => setName(e.target.value)} />
                <button className='m-4 btn btn-primary' onClick={submit}>ok</button>
                <button className='m-4 btn btn-info btn-sm' onClick={(Remove)}>remove</button>

                <ul>
                    {onlineStatus.map((status) => (
                        <li key={status.id}>
                            <p>Name: {status.name}</p>
                            <p>Status: {status.status}</p>
                            <button onClick={() => handleUpdateStatus(status.id)}>update</button>
                            {/* Add other fields as needed */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default RealTime
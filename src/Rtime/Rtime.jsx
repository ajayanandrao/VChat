import React, { useContext, useEffect, useState } from 'react'
import "./Rtime.scss";
import { child, get, getDatabase, onDisconnect, onValue, ref, set } from "firebase/database";
import { auth, realdb } from '../Firebase';
import { v4, uuidv4 } from 'uuid';
import { AuthContext } from '../AuthContaxt';

const Rtime = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");


    const reference = ref(realdb, "userStatus/" + currentUser.uid);
    const userPresenceRef = ref(realdb, "userPresence/" + currentUser.uid);


    const setUserOnline = async () => {
        try {
            const presenceRef = ref(realdb, "disconnectmessage/" + "1345");
            // Write a string when this client loses connection
            onDisconnect(presenceRef).set("I disconnected! now");
            // Check the user's connection status
            const connectionRef = ref(realdb, '.info/connected');
            const connectedSnap = await get(connectionRef);

            if (connectedSnap.val() === true) {
                // The user is connected to the server, set their status to "online"
                // await setDoc(userStatusRef, { status: 'online' });
                set(userPresenceRef, { status: 'online' });
            } else {
                // The user is not connected to the server, set their status to "offline"
                // await setDoc(userStatusRef, { status: 'offline' });
                set(userPresenceRef, { status: 'offline' });
            }
        } catch (error) {
            console.error('Error setting user status:', error);
        }
    }


    const SignUP = async (id) => {

        try {
            set(reference, {
                name: name,
                email: email,
                password: password,
                online: "food",
                uid: currentUser.uid,
            });
        } catch (error) {
            console.error("Error setting user online:", error);
        }
        // const uniqueKey = v4();

        setEmail("");
        setPassword("");
        setName("");
    }

    const userStatusRef = ref(realdb, 'userStatus/');

    const [rtimedata, setRtimedata] = useState(null);
    useEffect(() => {
        const dbRef = ref(realdb, 'userStatus/ QJLfbJ7V6oaAXdOj5CfHbwiWlAz2'); // Assuming you want to monitor a specific user's data

        const unsubscribe = onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const onlineStatus = snapshot.val() && snapshot.val().online;
                console.log(onlineStatus);
                setRtimedata(onlineStatus);
            } else {
                console.log("No data available");
            }
        }, {
            onlyOnce: true, // Use onlyOnce option to get the initial data when the component mounts
        });

        // Return a cleanup function to unsubscribe from the snapshot listener when the component unmounts
        return () => unsubscribe();
    }, []);



    return (
        <div className='Rtime-main-container'>
            <div className="left"></div>

            <div className='auth-div'>
                <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' value={password} className='inutauth' onChange={(e) => setPassword(e.target.value)} />
                <button className='btn btn-success' onClick={() => { SignUP(); setUserOnline(); }}>signUP</button>
            </div>

            <div className='text-4xl'>{rtimedata === "true" ? "hello" : "good"}</div>
        </div>
    )
}

export default Rtime
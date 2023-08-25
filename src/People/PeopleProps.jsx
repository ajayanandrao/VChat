import { collection, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import People from './People';
import { AuthContext } from '../AuthContaxt';

const PeopleProps = () => {
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


    return (
        <div>
            {api.map((item) => {
                if (item.uid === currentUser.uid) {
                    return (
                        <div key={item.id}>
                            <People userP={item} />
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default PeopleProps

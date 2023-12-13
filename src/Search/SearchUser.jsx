import React, { useContext, useEffect, useState } from 'react'
import "./SearchUser.scss";
import { Link, useNavigate } from 'react-router-dom';
import { db } from "./../Firebase";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';



const SearchUser = () => {

    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

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
    }, [currentUser && currentUser.uid]);


    return (
        <div className="d-flex">
            <div className="left">
            </div>
            <div className="search-main-container bg-light_0 dark:bg-dark">

                <div className="search-back-div bg-light_0 dark:bg-dark">
                    <div className="leftDiv"></div>
                    <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostIcon"></i>
                    <input type="text"
                        className='Seatch-User-input text-lightProfileName bg-lightDiv dark:bg-darkDiv dark:text-darkPostText'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder='Search friends ' />

                </div>

                <div className='search-user-position'>
                    {
                        api
                            .filter((value) => {
                                if (search === "") {
                                    return value;
                                } else if (
                                    value.name.toLowerCase().includes(search.toLowerCase())
                                ) {
                                    return value;
                                }
                            })
                            .map((item) => {

                                if (item.uid !== currentUser.uid) {
                                    return (
                                        <div key={item.id}>
                                            <div className="Search-user-profile-div">
                                                <div>
                                                    <img
                                                        src={item.PhotoUrl}
                                                        className="Search-user-profile-img"
                                                        alt=""
                                                    />
                                                </div>
                                                <Link to={`/${item.uid}`}>
                                                    <div className="Search-user-profile-name text-lightProfileName dark:text-darkProfileName">{item.name}</div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                }


                            })
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchUser

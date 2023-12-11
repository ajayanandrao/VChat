import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import "./WeddingList.scss";
import { Link } from 'react-router-dom';
import { CgClose } from 'react-icons/cg'
import mobile from "./../Image/img/png/call.png";
import brif from "./../Image/img/png/brif2.png";
import loc from "./../Image/img/png/loc.png";
import { CircularProgress } from '@mui/material';

const WeddingList = () => {

    const { currentUser } = useContext(AuthContext);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [filteredWeddingList, setFilteredWeddingList] = useState([]);

    const dataRef = collection(db, 'WeddingDatabase');
    const [weddingList, setWeddingList] = useState([]);
    const q = query(dataRef, orderBy('time', 'desc'));
    useEffect(() => {
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setWeddingList(data);
            setFilteredWeddingList(data);
            setLoading(false);
        });
        return unsub;
    }, []);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await deleteDoc(PresenceRefOnline);
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser.uid]);

    const handleDeleteItem = async (id) => {
        const dataRef = doc(db, 'WeddingDatabase', id);
        await deleteDoc(dataRef);
    }

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const filteredList = weddingList.filter(
            (item) =>
                item.displayName.toLowerCase().includes(searchQuery) ||
                item.first.toLowerCase().includes(searchQuery) ||
                item.last.toLowerCase().includes(searchQuery) ||
                item.mobile.includes(searchQuery) ||
                item.work.toLowerCase().includes(searchQuery) ||
                item.village.toLowerCase().includes(searchQuery) ||
                item.state.toLowerCase().includes(searchQuery)
        );
        setFilteredWeddingList(filteredList);
        setSearch(searchQuery);
    };


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
        <div className='weddingList-main-container'>
            <div className="left"></div>
            {loading ?
                <div className='skeleton-center bg-light_0 dark:bg-dark'>
                    <CircularProgress className='circularprogress' />
                </div >
                :
                <div className='w-100'>
                    <div className='weddinglist-search-div'>
                        <input type="text" placeholder='Search'
                            className='weddinglist-search bg-lightDiv text-lightPostList dark:bg-darkDiv dark:text-darkPostText'
                            onChange={handleSearch}
                            value={search}
                        />
                    </div>
                    <div className='weddinglist-wrapper'>

                        {api.map((user) => {
                            if (currentUser.uid === user.uid) {
                                return (
                                    <>

                                        <div>
                                            {filteredWeddingList.map((item) => {
                                                const canDelete = currentUser && currentUser.uid === item.uid;

                                                return (
                                                    <>
                                                        {user.subCast === item.subCast ? (<>

                                                            <div className='my-4 w-100' key={item.id}>

                                                                <div className="weddingList-card-container bg-lightDiv dark:bg-darkDiv">


                                                                    <div className="weddingList-sender-div">
                                                                        <img src={item.photoURL} className='weddingList-sender-photo' alt="" />
                                                                        <span style={{ textTransform: "capitalize" }} className='text-lightProfileName dark:text-darkProfileName'>{item.displayName}</span>

                                                                        {canDelete && (
                                                                            <div className='weddingList-delete-div text-lightProfileName dark:text-darkProfileName cursor-pointer' >
                                                                                <CgClose onClick={() => handleDeleteItem(item.id)} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <Link to={`/WeddingList/${item.id}`}>
                                                                        <div className="weddingList-profile-div">
                                                                            <div className='d-flex'>
                                                                                <img src={item.photoOne} className='weddingList-photo' alt="" />

                                                                                <div className="weddingList-about-div">
                                                                                    <div className='d-flex text-lightProfileName dark:text-darkProfileName' style={{ textTransform: "capitalize", fontSize: "24px", fontWeight: "600" }}>
                                                                                        <div className='me-1'>{item.first}</div>
                                                                                        <div>{item.last}</div>
                                                                                    </div>

                                                                                    <div className="weddingList-about-inner-div">
                                                                                        <div className="weddingList-about-inner-item">
                                                                                            <div style={{ display: "flex", justifyContent: "center", width: "40px" }}>
                                                                                                <img src={mobile} width={"35px"} style={{ marginRight: "0.5rem" }} alt="" />
                                                                                            </div>
                                                                                            <span className='text-lightProfileName dark:text-darkProfileName'> {item.mobile} </span>
                                                                                        </div>
                                                                                        <div className="weddingList-about-inner-item">
                                                                                            <div style={{ display: "flex", justifyContent: "center", width: "40px" }}>
                                                                                                <img src={brif} width={"33px"} style={{ marginLeft: "0.2rem", marginRight: "0.7rem" }} alt="" />
                                                                                            </div>
                                                                                            <span className='text-lightProfileName dark:text-darkProfileName'> {item.work} </span>
                                                                                        </div>
                                                                                        <div className="weddingList-about-inner-item">
                                                                                            <div style={{ display: "flex", justifyContent: "center", width: "40px" }}>
                                                                                                <img src={loc} width={"25px"} style={{ marginRight: "0.5rem" }} alt="" />
                                                                                            </div>
                                                                                            <div className='flex-1'>
                                                                                                <span className='text-lightProfileName dark:text-darkProfileName'> {item.village} </span>
                                                                                                <span className='ms-1 text-lightProfileName dark:text-darkProfileName'> {item.state} </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </>)
                                                            :
                                                            null
                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </>
                                )
                            }
                        })}
                    </div>
                </div>
            }
        </div>
    )
}

export default WeddingList

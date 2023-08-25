import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import "./WeddingList.scss";
import { FaMobile } from "react-icons/fa"
import { MdWork } from "react-icons/md"
import { ImLocation } from "react-icons/im"
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
    return (
        <div>
            {loading ?
                <div className='skeleton-center'>
                    <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
                </div >
                :

                <>
                    <div className='weddinglist-search-div'>
                        <input type="text" placeholder='Search'
                            className='weddinglist-search'
                            onChange={handleSearch}
                            value={search}
                        />
                    </div>
                    {filteredWeddingList.map((item) => {
                        const canDelete = currentUser && currentUser.uid === item.uid;
                        return (
                            <div className='my-4' key={item.id}>

                                <div className="weddingList-card-container">
                                    <div className="weddingList-sender-div">
                                        <img src={item.photoURL} className='weddingList-sender-photo' alt="" />
                                        <span style={{ textTransform: "capitalize" }}>{item.displayName}</span>

                                        {canDelete && (
                                            <div className='weddingList-delete-div' >
                                                <CgClose onClick={() => handleDeleteItem(item.id)} />
                                            </div>
                                        )}
                                    </div>
                                    <Link to={`/WeddingList/${item.id}`}>
                                        <div className="weddingList-profile-div">
                                            <div className='d-flex'>
                                                <img src={item.photoOne} className='weddingList-photo' alt="" />

                                                <div className="weddingList-about-div">
                                                    <div className='d-flex' style={{ textTransform: "capitalize", fontSize: "24px", fontWeight: "600" }}>
                                                        <div className='me-1'>{item.first}</div>
                                                        <div>{item.last}</div>
                                                    </div>

                                                    <div className="weddingList-about-inner-div">
                                                        <div className="weddingList-about-inner-item">
                                                            <div style={{ display: "flex", justifyContent: "center", width: "40px" }}>
                                                                <img src={mobile} width={"35px"} style={{ marginRight: "0.5rem" }} alt="" />
                                                                {/* <FaMobile style={{ fontSize: "24px", color: " #0080FF", marginRight: "0.5rem" }} /> */}
                                                            </div>
                                                            <span> {item.mobile} </span>
                                                        </div>
                                                        <div className="weddingList-about-inner-item">
                                                            <div style={{ display: "flex", justifyContent: "center", width: "40px" }}>
                                                                <img src={brif} width={"33px"} style={{ marginLeft: "0.2rem", marginRight: "0.7rem" }} alt="" />
                                                                {/* <MdWork style={{ fontSize: "24px", color: "#DF7401", marginRight: "0.5rem" }} /> */}
                                                            </div>
                                                            <span > {item.work} </span>
                                                        </div>
                                                        <div className="weddingList-about-inner-item">
                                                            <div style={{ display: "flex", justifyContent: "center", width: "40px" }}>
                                                                <img src={loc} width={"25px"} style={{ marginRight: "0.5rem" }} alt="" />
                                                                {/* <ImLocation style={{ fontSize: "24px", color: "#ccc", marginRight: "0.5rem" }} /> */}
                                                            </div>
                                                            <span > {item.village} </span>
                                                            <span className='ms-1'> {item.state} </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </>
            }
        </div>
    )
}

export default WeddingList

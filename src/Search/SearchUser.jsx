import React, { useContext, useEffect, useState } from 'react'
import "./SearchUser.scss";
import { MdDarkMode } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';
import { db } from "./../Firebase";
import { collection, onSnapshot } from 'firebase/firestore';
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


    return (
        <>
            <div className='search-wrapper'>
                <div className="search-container-inner">

                    <div className="Search-container">

                        <i onClick={goBack} className="bi bi-arrow-left "></i>
                        <input type="text"
                            className='Seatch-User-input'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Search friends' />

                    </div>

                    <div className="Search-user-List">
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
                                                    <img
                                                        src={item.PhotoUrl}
                                                        className="Search-user-profile-img"
                                                        alt=""
                                                    />
                                                    <Link to={`/users/${item.uid}`}>
                                                        <div className="Search-user-profile-name">{item.name}</div>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    }


                                })
                        }
                    </div>
                    <div className="Search-user-bottom">

                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchUser

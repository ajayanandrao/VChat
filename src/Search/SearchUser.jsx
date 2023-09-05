import React, { useContext, useEffect, useState } from 'react'
import "./SearchUser.scss";
import "./../People/People.scss";
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
        <div className=''>
            <div className='people-wrapper dark:bg-darkDiv'>

                <div className="people-wrapper-inner  ">

                    <div className="People-back-div">

                        <i onClick={goBack} className="bi bi-arrow-left dark:text-darkIcon "></i>
                        <input type="text"
                            className='People-User-input dark:bg-darkInput dark:text-darkPostText'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Search friends' />

                    </div>

                    <div className="People-user-List">
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
                                                <div className="people-container">
                                                    <div>
                                                        <img src={item.PhotoUrl} className="people-img" alt="" />
                                                    </div>

                                                    <div className="people-name-div">

                                                        <Link to={`/users/${item.uid}`}>
                                                            <div className="people-name dark:text-darkProfileName">{item.name}</div>
                                                        </Link>
                                                    </div>
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
        </div>
    )
}

export default SearchUser

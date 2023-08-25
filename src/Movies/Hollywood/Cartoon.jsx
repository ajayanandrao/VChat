import React, { useEffect, useState } from 'react'
import "./Hollywood.scss";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const Cartoon = () => {


    const [cartoonMovie, setCartoonMovie] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHollywoodMovies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Cartoon'));
                const cartoonMovieList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCartoonMovie(cartoonMovieList);
            } catch (error) {
                console.log('Error fetching Hollywood movies:', error);
            }
        };

        Promise.all([
            fetchHollywoodMovies(),
        ])
            .then(() => setLoading(false))
            .catch((error) => {
                console.log('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const [search, setSearch] = useState("");
    const filteredMovies = cartoonMovie.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.subName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {loading ?
                <div className='skeleton-center'>
                    <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
                </div >
                :
                <div className="hollywood-wrapper">
                    <input type="text"
                        placeholder='Serch Movie'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        className='friend-search' />

                    <div className="movie-grid-container">
                        {filteredMovies.map((item) => {
                            return (
                                <div key={item.id}>
                                    <Link to={`/cartoonMovie/${item.id}`}>
                                        <div className='movie-card-div'>
                                            <div>
                                                <img src={item.mobileImg} className='movie-card-img' alt="" />
                                            </div>
                                            <div className="movie-card-name-wrapper">
                                                <div className='movie-card-name'>{item.name}</div>
                                                <div className='movie-card-subName'>{item.subName}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    )
}

export default Cartoon

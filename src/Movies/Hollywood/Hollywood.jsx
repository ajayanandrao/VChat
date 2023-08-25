import React, { useEffect, useState } from 'react'
import "./Hollywood.scss";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Avatar, Box, CardMedia, CircularProgress, IconButton, Skeleton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import m from "./../hollywood.json";
import { Card, CardContent, CardHeader } from 'semantic-ui-react';

const Hollywood = () => {


    const [hollywoodMovie, setHollywoodMovie] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHollywoodMovies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Hollywood'));
                const hollywoodMovieList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setHollywoodMovie(hollywoodMovieList);
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
    const filteredMovies = hollywoodMovie.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.subName.toLowerCase().includes(search.toLowerCase())
    );




    return (
        <>

            <div className="hollywood-wrapper">
                {loading ?

                    <>
                        <input type="text"
                            placeholder='Serch Movie'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            className='friend-search' />



                        <div className="movie-grid-container">
                            {m.map((item) => {
                                return (

                                    <div className="skelton-card">
                                        <Skeleton variant="rectangular" className='skeleton' width={150} height={220} >
                                        </Skeleton>
                                        <Skeleton animation="wave" className='skelton-w' />
                                        <Skeleton animation="wave" className='skelton-ww' />
                                    </div>
                                )
                            })}
                        </div>
                    </>

                    // <div className='skeleton-center'>
                    //     <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
                    // </div >
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
                                        <Link to={`/hollywoodmovie/${item.id}`}>
                                            <div className='movie-card-div'>
                                                <div className=''>
                                                    {item.mobileImg ? <img src={item.mobileImg} className='movie-card-img' alt="" /> :
                                                        <Skeleton variant="rectangular" className='skeleton' width={150} height={220} />
                                                    }

                                                </div>
                                                <div className="movie-card-name-wrapper ">
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
            </div>
        </>
    )
}

export default Hollywood

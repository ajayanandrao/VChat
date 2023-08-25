import React, { useEffect, useState } from 'react'
import "./Movies.scss";
import Flickity from 'react-flickity-component';
import mapi from "./m.json";
import trailer from "./trailer.json";
import holly from "./hollywood.json";
import bolly from "./bollywood.json";
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import { CircularProgress, Skeleton } from '@mui/material';

const Movies = () => {
    var flickityOptions = {
        initialIndex: 0,
        wrapAround: true,
        autoPlay: 2000
    }
    var hollywood = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 2500
    }
    var bollywood = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 2000
    }
    var cartoon = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 1500
    }

    const [users, setUsers] = useState([]);
    const [movieTrailer, setMovieTrailer] = useState([]);
    const [hollywoodMovie, setHollywoodMovie] = useState([]);
    const [bollywoodMovie, setBollywoodMovie] = useState([]);
    const [cartoonMovie, setCartoonMovie] = useState([]);
    const [latestMovie, setLatestMovie] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'MovieCat'));
                const userList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userList);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        const fetchMovieTrailers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'MovieTrailers'));
                const movieTrailerList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMovieTrailer(movieTrailerList);

            } catch (error) {
                console.log('Error fetching movie trailers:', error);
            }
        };

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
        const fetchBollywoodMovies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Bollywood'));
                const bollywoodMovieList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBollywoodMovie(bollywoodMovieList);

            } catch (error) {
                console.log('Error fetching Hollywood movies:', error);

            }
        };
        const fetchCartoonMovies = async () => {
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
        const fetchLatestMovies = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'LatestMovie'));
                const cartoonMovieList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLatestMovie(cartoonMovieList);
            } catch (error) {
                console.log('Error fetching Latest movies:', error);
            }
        };

        Promise.all([
            fetchUsers(),
            fetchMovieTrailers(),
            fetchHollywoodMovies(),
            fetchBollywoodMovies(),
            fetchCartoonMovies(),
            fetchLatestMovies()
        ])
            .then(() => setLoading(false))
            .catch((error) => {
                console.log('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    return (
        <>

            {loading ? (
                <div className='skeleton-center'>
                    <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
                </div >


            ) : (
                <div className='movie-main-container'>
                    <Flickity
                        className='carouse'
                        elementType={'div'}
                        options={flickityOptions}
                        disableImagesLoaded={false}>
                        {latestMovie.map((trailer) => {
                            return (
                                <>
                                    <Link key={trailer.id} to={`/latestMovie/${trailer.id}`}>
                                        <div style={{ backgroundImage: `url(${trailer.img})` }} className="mover-trailer-card">

                                            <div className="trailer-data-div">
                                                <div className='trailer-name'>{trailer.name}</div>
                                                <div className='trailer-name sub'>{trailer.subname}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            )
                        })}

                    </Flickity>


                    <div className="category-grid-center">
                        <div className="categaory-container">

                            <Link to="/hollywood/">
                                <div className="category-card-div">
                                    <div style={{ backgroundImage: "url(https://i0.wp.com/www.wonderslist.com/wp-content/uploads/2018/12/Highest-Grossing-Hollywood-Movies.jpg)" }} className="category-card">
                                        Hollywood
                                    </div>
                                </div>
                            </Link>

                            <Link to="/bollywood/">
                                <div className="category-card-div">
                                    <div style={{ backgroundImage: "url(https://six.psbdigital.ca/wp-content/uploads/2020/02/Bollywood-women.jpg)" }} className="category-card">
                                        Bollywood
                                    </div>
                                </div>
                            </Link>

                            <Link to="/cartoon/">
                                <div className="category-card-div">
                                    <div style={{ backgroundImage: "url(https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQRrh5TH_ntm9CfPqCc84-J3OUcBfwPJMHo97cexNA1Mno_GrpMEnYke1axs4wo2xf3lpOaPGuIYil2AqsG4hAta82pL-iNv7t2VTR9GoOBsmGRRTI_eVICWNh-CT4YpOpdu4_QBEbFBXdSkpsZRKPJP3AIE.jpg?r=e71)" }} className="category-card">
                                        Cartoon
                                    </div>
                                </div>
                            </Link>


                            <Link to="/webSeries/">
                                <div className="category-card-div">
                                    <div style={{ backgroundImage: "url(https://static.toiimg.com/photo/87533357.cms)" }} className="category-card">
                                        Web Series
                                    </div>
                                </div>
                            </Link>

                            {/* {users.map((movie) => {
                                return (
                                    <>
                                        <Link key={movie.id} to={`/movie/${movie.id}`}>
                                            <div className="category-card-div">
                                                <div style={{ backgroundImage: `url(${movie.img})` }} className="category-card">
                                                    {movie.name}
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                )
                            })} */}

                        </div>
                    </div>

                    <Link to="/requestMovie/">
                        <h4 style={{ textAlign: "center", fontWeight: "600", color: "#088A85" }}>
                            Request Movies
                        </h4>
                    </Link>



                    <div className="category-div">Bollywood <div className="see-more"></div></div>

                    <Flickity
                        className='carouse'
                        elementType={'div'}
                        options={bollywood}
                        disableImagesLoaded={false}>

                        {
                            bollywoodMovie.map((holly) => {
                                return (
                                    <>
                                        <Link key={holly.id} to={`/bollywoodmovie/${holly.id}`}>
                                            <div key={holly.id} style={{ backgroundImage: `url(${holly.img})` }} className="hollywood-card">

                                            </div>
                                        </Link>
                                    </>
                                )
                            })
                        }

                    </Flickity>


                    <div className="category-div">Hollywood <div className="see-more"></div></div>

                    <Flickity
                        className='carouse'
                        elementType={'div'}
                        options={hollywood}
                        disableImagesLoaded={false}>

                        {hollywoodMovie.map((holly) => {
                            return (
                                <>
                                    <Link key={holly.id} to={`/hollywoodmovie/${holly.id}`}>
                                        <div style={{ backgroundImage: `url(${holly.img})` }} className="hollywood-card">

                                        </div>
                                    </Link>
                                </>
                            )
                        })}

                    </Flickity>

                    <div className="category-div">Cartoon/Disney <div className="see-more"></div></div>

                    <Flickity
                        className='carouse'
                        elementType={'div'}
                        options={cartoon}
                        disableImagesLoaded={false}>

                        {cartoonMovie.map((holly) => {
                            return (
                                <>
                                    <Link key={holly.id} to={`/cartoonMovie/${holly.id}`}>
                                        <div style={{ backgroundImage: `url(${holly.img})` }} className="hollywood-card">

                                        </div>
                                    </Link>
                                </>
                            )
                        })}

                    </Flickity>


                </div>
            )}


        </>
    )
}

export default Movies

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import "./cat.scss";

const CategoryParam = () => {
    const { id } = useParams();
    const [movieCat, setMovieCat] = useState(null);
    const [hollywoodcat, setHollywoodCat] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'MovieCat', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setMovieCat({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        if (movieCat) {
            const unsubscribe = onSnapshot(
                query(collection(db, 'MovieCat', movieCat.id, 'Hollywood')),
                (snap) => {
                    setHollywoodCat(
                        snap.docs.map((snap) => ({
                            id: snap.id,
                            ...snap.data(),
                        }))
                    );
                }
            );

            return unsubscribe;
        }
    }, [movieCat]);


    if (!movieCat) {
        return (
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div>
        );
    }


    return (
        <>
            {hollywoodcat && hollywoodcat.map((movie) => (
                <div key={movie.id}>
                    <Link to={`/hollywood-movie/${movie.id}`}>
                        <div className='movie-banner-div'>
                            <img src={movie.img} className='movie-banner' alt="" />
                        </div>
                    </Link>
                </div>
            ))}
        </>
    );
};

export default CategoryParam;

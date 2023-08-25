import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { CircularProgress } from '@mui/material';

const MovieTrailer = () => {

    const { id } = useParams();
    const [movieTrailer, MovieTrailer] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'MovieTrailers', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    MovieTrailer({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!movieTrailer) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }
    return (
        <>
            {/* <video style={{ width: "100%", height: "300px" }} className="reel-video" autoPlay >
                <source src="https://www.youtube.com/watch?v=4_yDwhvNCII" type="video/mp4" />
            </video> */}


            <iframe width="100%" height="315" src={movieTrailer.trailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

        </>
    )
}

export default MovieTrailer

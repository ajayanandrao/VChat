import React, { useEffect, useState } from 'react'
import "./PeopleFlickity.scss";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import Flickity from 'react-flickity-component';

const PeopleFlickity = () => {

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    var flickityOptions = {
        initialIndex: 2,
        wrapAround: true,
        autoPlay: 1500
    }
    return (
        <>
            <Flickity
                className='carouse'
                elementType={'div'}
                options={flickityOptions}
                disableImagesLoaded={false}>

                {api.map((item)=>{
                    return(
                        <>
                        <img src={item.photoURL} className='people-flickity-img' alt="" />
                        </>
                    )
                })}

            </Flickity>
        </>
    )
}

export default PeopleFlickity

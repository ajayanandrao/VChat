import React, { useState } from 'react'
import { db, storage } from '../Firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const AddTrailer = () => {

    const [name, setName] = useState("");
    const [subName, setSubName] = useState("");
    const [img, setImg] = useState(null);
    const [trailer, setTrailer] = useState(null);

    const Save = async () => {
        try {
            const storageRef = ref(storage, "Trailer/" + name);
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on('state_changed',
                (snapshot) => {

                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);
                        const movieRef = collection(db, "MovieTrailers");
                        await addDoc(movieRef, {
                            name: name,
                            subName: subName,
                            img: downloadURL
                        });

                    });
                }
            );

        }
        catch { }

        setName("");
        setSubName("");
        setImg(null);
    };

    return (
        <>
            <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
            <input type="text" placeholder='sub name' onChange={(e) => setSubName(e.target.value)} value={subName} />
            <label htmlFor="">
                <input type="file" placeholder='img' onChange={(e) => setImg(e.target.files[0])} />
                image
            </label>

            <label htmlFor="">
                <input type="file" placeholder='trailer' onChange={(e) => setName(e.target.files[0])} />
                trailer
            </label>
            <button className='btn btn-info' onClick={Save}>save</button>
        </>
    )
}

export default AddTrailer

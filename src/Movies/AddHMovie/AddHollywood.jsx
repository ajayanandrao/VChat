import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import "./AddHollywood.scss";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db, storage } from '../../Firebase';
import { CircularProgress } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

const AddHollywood = () => {

    const { id } = useParams();
    const [movieCat, MovieCat] = useState(null);
    const [name, setName] = useState("");
    const [subName, setSubName] = useState("");
    const [img, setImg] = useState(null);
    const [trailerVid, setTrailerVid] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'MovieCat', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    MovieCat({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!movieCat) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }


    // const Save = async () => {
    //     const movieRef = collection(db, "Bollywood");

    //     try {
    //         const trailerRef = ref(storage, "BTrailer/" + name);
    //         const storageRef = ref(storage, "Bollywood/" + name);

    //         // ----------------------

    //         const imgUploadTask = uploadBytesResumable(storageRef, img);
    //         imgUploadTask.on('state_changed', (snapshot) => {
    //             const progress = Math.round(
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //             );
    //             console.log("Poster :", progress);
    //             if (progress === 100) {
    //                 console.log("Poster successfully uploaded");
    //             }
    //         });
    //         // Upload trailer video file
    //         const trailerVidUploadTask = uploadBytesResumable(trailerRef, trailerVid);
    //         trailerVidUploadTask.on('state_changed', (snapshot) => {
    //             const progress = Math.round(
    //                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //             );
    //             console.log("Loading:", progress);
    //             if (progress === 100) {
    //                 console.log("Trailer video successfully uploaded");
    //             }
    //         });

    //         Promise.all([
    //             getDownloadURL(imgUploadTask.snapshot.ref),
    //             getDownloadURL(trailerVidUploadTask.snapshot.ref),

    //         ]).then(async ([imgDownloadURL, trailerVidDownloadURL]) => {
    //             await addDoc(movieRef, {
    //                 name: name,
    //                 subName: subName,
    //                 img: imgDownloadURL,
    //                 trailer: trailerVidDownloadURL,
    //                 uid: v4()
    //             });
    //         });
    //     } catch (error) {
    //         console.log("Error:", error);
    //     }

    //     setName("");
    //     setSubName("");
    //     setImg(null);
    //     setTrailerVid(null);
    // };

    const Save = async () => {
        if (img || name) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "LatestScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            ImgSaveData(downloadURL);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                ImgSaveData(downloadURL); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    // LatestMovie, Hollywood, Bollywood, Cartoon

    //LatestScreen, Screen, BScreen, CScreen

    const ImgSaveData = async (downloadURL) => {
        const movieRef = collection(db, "LatestMovie");

        await addDoc(movieRef, {
            name: name,
            subName: subName,
            img: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };



    return (
        <>

            <div className='add-holy-container'>
                <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
                <input type="text" className='my-4' placeholder='sub name' onChange={(e) => setSubName(e.target.value)} value={subName} />


                <label htmlFor="">
                    <input type="file" placeholder='img' onChange={(e) => setImg(e.target.files[0])} />
                    image
                </label>

                <label htmlFor="" className='mt-3'>
                    <input type="file" placeholder='trailer' onChange={(e) => setTrailerVid(e.target.files[0])} />
                    Video
                </label>

                <button className='btn btn-info my-4' onClick={Save}>save</button>


            </div>
        </>
    )
}

export default AddHollywood

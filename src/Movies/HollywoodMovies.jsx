import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db, storage } from '../Firebase';
import { CircularProgress } from '@mui/material';
import "./HollywoodMovies.scss";
import { FaPlay } from 'react-icons/fa';
import { ImArrowLeft2 } from 'react-icons/im'
import { getDownloadURL, getMetadata, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { AuthContext } from '../AuthContaxt';

const HollywoodMovies = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const [hollywood, Hollywood] = useState(null);
    const [hollywoodData, setHollywoodData] = useState([]);

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };

    const handleVideoBtnClick = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'Hollywood', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    Hollywood({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const colRef = collection(db, "Hollywood")

    useEffect(() => {
        const unsub = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setHollywoodData(newbooks);
            })
        };
        return unsub();
    }, []);



    const handleDownload = () => {

        const x = document.getElementById('less');

        if (x.style.display == 'none') {
            x.style.display = 'flex';
        }
        else {
            x.style.display = 'none';
        }

        if (friendsList.length < 5) {
            document.getElementById("less").innerHTML = `to download any movie you need to have minimum 5 friends. 
            your total friends is ${friendsList.length}`;

        } else {

            const item = hollywoodData.find((item) => item.id === id);
            if (item) {
                x.style.display = 'none';
                const downloadLink = document.createElement('a');
                downloadLink.href = item.trailer;
                downloadLink.download = 'trailer.mp4';
                downloadLink.click();
            }

        }
        // 0/
    };

    const [name, setName] = useState("");
    const [img, setImg] = useState(null);

    const OneUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            saveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                saveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const saveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            img: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const TwoUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            TwosaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                TwosaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const TwosaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            two: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    const ThreeUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            ThreesaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                ThreesaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const ThreesaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            three: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    const FourUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            FoursaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                FoursaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const FoursaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            four: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    const FiveUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            FivesaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                FivesaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const FivesaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            five: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const SixUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            SixsaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                SixsaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const SixsaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            six: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const ImgUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            ImgSaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                ImgSaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const ImgSaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            img: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const MobileImgUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Screen/" + v4());
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
                            MobileImgSaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                MobileImgSaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const MobileImgSaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            mobileImg: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const TrailerUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Trailer/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Trailer Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            TrailerSaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                TrailerSaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const TrailerSaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Hollywood", id);

        await updateDoc(movieRef, {
            trailer: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };



    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(collection(db, `allFriends/${currentUser.uid}/Friends`));
                const friendsSnapshot = await getDocs(friendsQuery);
                const friendsData = friendsSnapshot.docs.map(doc => doc.data());
                setFriendsList(friendsData);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);


    if (!hollywood) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    return (
        <>
            <div className='main-wrapper'>
                {hollywoodData.map((item) => {
                    if (item.id === id) {
                        const thumbnailImageURL = item.img;

                        return (
                            <div key={item.id} className="hollywood-main-div">
                                <div className="hollywood-video-div">
                                    <video ref={videoRef} className="trailer-video" poster={thumbnailImageURL} onClick={() => handleVideoBtnClick()}>
                                        <source src={item.trailer} type="video/mp4" />
                                    </video>

                                    {!isPlaying && (
                                        <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                            <div className="play-button-div">
                                                <div className="play-btn-div">
                                                    <FaPlay className='play-btn-icon' />
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    }
                })}


                {hollywoodData.map((item) => {
                    if (item.id === id) {
                        return (
                            <div key={item.id}>
                                <div style={{ textAlign: "center", textTransform: "uppercase", fontSize: "20px", fontWeight: "600", marginTop: "10px" }}>{item.name}</div>
                            </div>
                        )
                    }
                })}

                <div className="movie-desc-div">
                    <span className='movie-desc-language'>Language:-
                        <span className='language-one ms-2' >Hindi</span>
                        <span className='language-one ms-2'>English</span>
                        <span className='language-one ms-2'>(Dual Audio)</span>
                    </span>
                </div>

                <h4 style={{ color: "#045FB4", fontWeight: "600", textAlign: "center" }}>ScreenShots</h4>


                {hollywoodData.map((item) => {
                    if (item.id === id) {
                        return (
                            <>
                                <div key={item.id}>
                                    <div className='screenShot-grid-div'>
                                        <img src={item.one} className='screenShot-img' alt="" />
                                        <img src={item.two} className='screenShot-img' alt="" />
                                        <img src={item.three} className='screenShot-img' alt="" />
                                        <img src={item.four} className='screenShot-img' alt="" />
                                        <img src={item.five} className='screenShot-img' alt="" />
                                        <img src={item.six} className='screenShot-img' alt="" />
                                    </div>
                                </div>
                            </>
                        )
                    }
                })}



                {/* {hollywoodData.map((item) => {
                    if (item.id === id) {
                        return (
                            <>
                                <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
                                <label htmlFor="">
                                    <input type="file" placeholder='img' onChange={(e) => setImg(e.target.files[0])} />
                                    image
                                </label>

                                <button className='btn btn-success mt-4' onClick={() => OneUpdate(id)}>One</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => TwoUpdate(id)}>Two</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => ThreeUpdate(id)}>Three</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => FourUpdate(id)}>Four</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => FiveUpdate(id)}>Five</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => SixUpdate(id)}>Six</button>

                                <button className='btn btn-primary mt-4 ms-2' onClick={() => ImgUpdate(id)}>Poster</button>
                                <button className='btn btn-primary mt-4 ms-2' onClick={() => MobileImgUpdate(id)}>Poster</button>

                                <button className='btn btn-primary mt-4 ms-2' onClick={() => TrailerUpdate(id)}>Trailer</button>

                            </>
                        )
                    }
                })} */}


                <div style={{ marginTop: '20px', display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", textAlign: 'center' }}>

                    <div class="alert alert-danger" role="alert" id='less' style={{ display: "none" }}>
                    </div>

                    <button className="btn-success-custom" onClick={handleDownload}>
                        Download
                    </button>
                </div>

            </div>

            <div className="movie-back-btn">
                <div className="back-arrow-div" onClick={goBack}>
                    <ImArrowLeft2 className="bi bi-arrow-left movie-back-arrow-icon" onClick={handleDownload} />
                </div>
            </div>
        </>
    )
}

export default HollywoodMovies

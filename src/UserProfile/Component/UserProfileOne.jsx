import React, { useContext, useEffect, useRef, useState } from 'react'
import "./UserProfileOne.scss";
import { useNavigate } from 'react-router-dom';
import { BsFillCameraFill, BsImages } from "react-icons/bs";
import { AuthContext } from "./../../AuthContaxt";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../Firebase';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { CircularProgress, LinearProgress } from '@mui/material';
import { IoIosCloseCircle, IoMdClose } from 'react-icons/io';
import imageCompression from 'image-compressor';
import { v4, uuidv4 } from 'uuid';
import v1 from "./../../Image/video/videoa.mp4";
import v1img from "./../../Image/video/videoa.png";
import v2 from "./../../Image/video/xmq3nirr.mp4";
import v2img from "./../../Image/video/xmq3nirr.png";
import v3 from "./../../Image/video/wl49glts.mp4";
import v3img from "./../../Image/video/wl49glts.png";
import v44 from "./../../Image/video/tunnel.mp4";
import v4img from "./../../Image/video/tunnel.png";
import { AiOutlineClose } from 'react-icons/ai';
import { Windows } from 'react-bootstrap-icons';
import { MdClose } from 'react-icons/md';

const ProfileOne = ({ user }) => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handleClick = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const fileInput = useRef(null);

    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [img, setImg] = useState(null);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProfilePhoto(file);
        handleUpload(file);
        setImg(file);
    };


    const profileDataRef = doc(db, "UpdateProfile", currentUser?.uid ?? 'default');

    const compressImageProfile = async (imageFile, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(imageFile);
        });
    };


    const handleUpload = async (file) => {
        setLoading(true);

        if (file) {
            if (file.type.startsWith('image/')) {

                try {
                    // Create a Firebase Storage reference to the NewProfilePhotos folder with a unique name

                    const compressedImgBlob = await compressImageProfile(file, 800);

                    const timestamp = new Date().getTime();
                    const storageRef = ref(storage, `NewProfilePhotos/${timestamp}-${file.name}`);

                    // Upload the selected image file to Firebase Storage
                    await uploadBytes(storageRef, compressedImgBlob);
                    // Get download URL for uploaded file
                    const downloadURL = await getDownloadURL(storageRef);

                    // Update user profile with new photoURL
                    await updateProfile(auth.currentUser, { photoURL: downloadURL });

                    await setDoc(profileDataRef, {
                        userPhoto: downloadURL,
                    }, { merge: true });

                    // Update user collection photoUrl

                    const userRef = doc(db, 'users', user.id);
                    await updateDoc(userRef, { PhotoUrl: downloadURL });

                    // Update OnlyOnline collection photoUrl

                    // console.log(user.uid);
                    const onlineRef = doc(db, 'OnlyOnline', user.uid);
                    await updateDoc(onlineRef, { photoUrl: downloadURL });

                    // Update AllPost collections post photoUrl 

                    const postsRef = collection(db, 'AllPosts');

                    const userPostsQuery = query(postsRef, where('uid', '==', currentUser.uid));
                    const userPostsSnapshot = await getDocs(userPostsQuery);

                    const batch = writeBatch(db);
                    userPostsSnapshot.forEach((postDoc) => {
                        const postRef = doc(db, 'AllPosts', postDoc.id);
                        batch.update(postRef, { photoURL: downloadURL });
                    });

                    await batch.commit();

                    // 

                    const userPostPhotoRef = collection(db, "UserPostPhoto");

                    await addDoc(userPostPhotoRef, {
                        name: img ? img.name : '',
                        img: img ? downloadURL : '', // Only use the downloadURL if a img was uploaded
                        uid: currentUser.uid,
                        photoURL: currentUser.photoURL,
                        displayName: currentUser.displayName,
                        bytime: serverTimestamp(), // Use the server timestamp here
                    });


                    window.location.reload();

                    // console.log('Profile photo updated successfully!');
                } catch (error) {
                    console.error('Error updating profile photo:', error);
                }

            }
        }

        setLoading(false);

    };

    //  Cover Photo

    function on() {
        document.getElementById("Cover").style.display = "block";
        document.getElementById("video-size").innerHTML = '';
    }

    function off() {
        setCover(null);
        document.getElementById("Cover").style.display = "none";
    }
    const [cover, setCover] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);

    // Inside the useEffect section of the ProfileOne component
    useEffect(() => {
        const fetchProfileData = async () => {
            const docRef = doc(db, "UpdateProfile", currentUser?.uid ?? "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check if the browser supports WebP format
                const supportsWebP = (new Image()).srcset.includes('webp');
                setImageUrl(supportsWebP && data.webpImageUrl ? data.webpImageUrl : data.imageUrl);
                setVideoUrl(data.VideoCover)
            }
        };
        fetchProfileData();
    }, [currentUser?.uid]);


    const [coverImg, setCoverImg] = useState([]);
    const [loadingCoverData, setLoadingCoverData] = useState(true);

    useEffect(() => {
        const colRef = collection(db, 'UpdateProfile');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setCoverImg(newApi);
            setLoadingCoverData(false);
        });

        return unsubscribe;
    }, []);

    const compressImage = async (imageFile, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(imageFile);
        });
    };


    const CoverUpload = async () => {
        let downloadURL = '';

        if (cover) {
            if (cover.type.startsWith('image/')) {
                try {
                    const compressedImgBlob = await compressImage(cover, 800);

                    const imageRef = ref(storage, `images/${cover.name}`);
                    const uploadTask = uploadBytes(imageRef, compressedImgBlob);

                    uploadTask.then(async (snapshot) => {
                        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                        if (progress == 90) { off(); }
                        // console.log("Uploaded image successfully");
                        const url = await getDownloadURL(imageRef);
                        setImageUrl(url);

                        await setDoc(profileDataRef, {
                            // CoverName: url.name,
                            CoverPhoto: url,
                            VideoCover: "",
                        }, { merge: true });

                        // console.log("Image URL added to Firestore");
                    }).catch((error) => {
                        console.error("Error uploading image", error);
                    });
                } catch (error) {
                    console.log("Error compressing Cover Image:", error);
                }
            } else if (cover.type.startsWith('video/')) {
                // Check if the video size is greater than 2 MB (2 * 1024 * 1024 bytes)
                if (cover.size > 3 * 1024 * 1024) {
                    // Display an alert to the user
                    off();
                    // alert('Video size should be less than 3 MB');
                    document.getElementById("video-size").innerHTML = 'Cover Video size should be less than 3 MB';
                    return
                } else {
                    const storageRef = ref(storage, 'PostVideos/' + v4());
                    const uploadTask = uploadBytesResumable(storageRef, cover);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                            if (progress < 100) {
                                // console.log(progress)
                                document.getElementById('p1').innerHTML = progress;
                            } else {
                                document.getElementById('p1').style.display = 'none';
                            }
                            // console.log('Loading:', progress);
                        },
                        (error) => {
                            console.log('Error uploading video:', error);
                        },
                        async () => {
                            try {
                                await uploadTask;
                                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                // console.log(downloadURL);

                                await setDoc(profileDataRef, {
                                    CoverPhoto: "",
                                    VideoCover: downloadURL,
                                }, { merge: true });

                                // console.log('Video uploaded successfully');

                                if (downloadURL) {
                                    window.location.reload();
                                }
                            } catch (error) {
                                console.log('Error uploading video:', error);
                            }
                        }
                    );
                }
            }
        }

        off();
    };


    const dataRef = collection(db, "users");
    const [userPhoto, setUserPhoto] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(dataRef, (snapshot) => {
            setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);

    function onProfile() {
        document.getElementById("ProfileOneImg").style.display = "block";
    }

    function offProfile() {
        document.getElementById("ProfileOneImg").style.display = "none";
    }

    const [selectMedia, setSelectMedia] = useState(false);
    const handleSelectMedia = () => {
        setSelectMedia(!selectMedia);
    };


    const CoverUploadSelected1 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "https://wallpapercave.com/dwp1x/wp4676609.jpg",
            VideoCover: "",
        }, { merge: true });
    };
    const CoverUploadSelected2 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "https://images.pexels.com/photos/50594/sea-bay-waterfront-beach-50594.jpeg?auto=compress&cs=tinysrgb&w=600",
            VideoCover: "",
        }, { merge: true });
    };
    const CoverUploadSelected3 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600",
            VideoCover: "",
        }, { merge: true });
    };
    const CoverUploadSelected4 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "https://wallpapercave.com/wp/wp3276802.jpg",
            VideoCover: "",
        }, { merge: true });
    };
    const CoverUploadSelected5 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "https://wallpapercave.com/dwp1x/wp12160293.jpg",
            VideoCover: "",
        }, { merge: true });
    };
    const CoverUploadSelected6 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "https://wallpapercave.com/dwp1x/wp8973901.jpg",
            VideoCover: "",
        }, { merge: true });
    };



    // =========================== Video =======================


    const CoverUploadSelectedV1 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "",
            VideoCover: "https://cdn.pixabay.com/vimeo/413229662/waterfall-37088.mp4?width=1280&hash=54c84b2ca737681a766f0f1822824f6a7afa5106",
        }, { merge: true });
        window.location.reload();
    };
    const CoverUploadSelectedV2 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "",
            VideoCover: "https://cdn.pixabay.com/vimeo/549547533/sand-73847.mp4?width=1280&hash=306f3b58e8d2383aa9ce400a57576a72474ecaf4",
        }, { merge: true });
        window.location.reload();
    };
    const CoverUploadSelectedV3 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "",
            VideoCover: "https://cdn.pixabay.com/vimeo/514501835/tunnel-65495.mp4?width=1280&hash=16eb80794988b7948fc513c19c27bd6daa2982dc",
        }, { merge: true });
        window.location.reload();
    };
    const CoverUploadSelectedV44 = async () => {
        await setDoc(profileDataRef, {
            // CoverName: url.name,
            CoverPhoto: "",
            VideoCover: "https://firebasestorage.googleapis.com/v0/b/hosting-c26ea.appspot.com/o/Cover%20Video%2Ftunnel.mp4?alt=media&token=f4ef5d47-b409-4861-acbf-36ff28a1588b",
        }, { merge: true });
        window.location.reload();
    };

    return (
        <>

            <div>

                {loadingCoverData ? (

                    <div className='placeholder-glow loading-profile-cover-photo-div'>
                        <div className="placeholder placeholder-dimension bg-lightPostIcon dark:bg-darkPostIcon">
                            <div className="placeholder-dimension-img bg-[white] dark:bg-darkDiv"></div>
                        </div>
                    </div>

                ) : (

                    <>

                        <div id="ProfileOneImg" onClick={offProfile} >
                            <div id="ProfileOneImg-text">
                                <img src={currentUser && currentUser.photoURL} className='ProfileOneImg-photo' alt="" />
                            </div>
                        </div>

                        <div className='video-progress' id='p1'></div>

                        {selectMedia ?
                            <div className="profile-cover-select-media">
                                <div className="left"></div>
                                <div className="profile-cover-select-media-inner">
                                    <div className="profile-media-wrapper bg-lightDiv dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                                        <div className="profile-media-wrapper-close text-lightProfileName dark:text-darkProfileName ">
                                            <div className='profile-media-wdrapper-btn' onClick={handleSelectMedia}>
                                                <MdClose onClick={handleSelectMedia} />
                                            </div>
                                        </div>
                                        <div className="profile-media-from-device-div">
                                            <div className='profile-media-folder' onClick={() => { handleSelectMedia(); on(); }}>
                                                <BsImages />
                                            </div>
                                            <div className="profile-media-folder-name" onClick={() => { handleSelectMedia(); on(); }}>
                                                Select From Device
                                            </div>
                                        </div>
                                        Wallpepars
                                        <div className="profile-media-grid-center">
                                            <div className=' profile-media-grid'>
                                                <img className='profile-cover-media-img' onClick={CoverUploadSelected1} src="https://wallpapercave.com/dwp1x/wp4676609.jpg" alt="" />

                                                <img className='profile-cover-media-img' onClick={CoverUploadSelected2} src="https://images.pexels.com/photos/50594/sea-bay-waterfront-beach-50594.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />

                                                <img className='profile-cover-media-img' onClick={CoverUploadSelected3} src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />

                                                <img className='profile-cover-media-img' onClick={CoverUploadSelected4} src="https://wallpapercave.com/wp/wp3276802.jpg" alt="" />

                                                <img className='profile-cover-media-img' onClick={CoverUploadSelected5} src="https://wallpapercave.com/dwp1x/wp12160293.jpg" alt="" />

                                                <img className='profile-cover-media-img' onClick={CoverUploadSelected6} src="https://wallpapercave.com/dwp1x/wp8973901.jpg" alt="" />
                                            </div>
                                        </div>
                                        Video
                                        <div className="profile-media-grid-center-video">
                                            <div className="profile-media-grid">
                                                <div className="profile-cover-media-video" onClick={CoverUploadSelectedV1} style={{ backgroundImage: `url(${v1img})` }}>
                                                    <video className='profile-cover-media-video-file' src={v1} autoPlay loop muted />
                                                </div>

                                                <div className="profile-cover-media-video" onClick={CoverUploadSelectedV2} style={{ backgroundImage: `url(${v2img})` }}>
                                                    <video className='profile-cover-media-video-file' src={v2} autoPlay loop muted />
                                                </div>

                                                <div className="profile-cover-media-video" onClick={CoverUploadSelectedV3} style={{ backgroundImage: `url(${v3img})` }}>
                                                    <video className='profile-cover-media-video-file' src={v3} autoPlay loop muted />
                                                </div>

                                                <div className="profile-cover-media-video" onClick={CoverUploadSelectedV44} style={{ backgroundImage: `url(${v4img})` }}>
                                                    <video className='profile-cover-media-video-file' src={v44} autoPlay loop muted />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }

                        <div>
                            {coverImg.map((item) => {
                                if (item.uid === currentUser.uid) {

                                    return (
                                        <div key={item.id}>

                                            <div className="profile-cover-photo-div"
                                                style={{ backgroundImage: `url(${item.CoverPhoto ? item.CoverPhoto : 'https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80'})` }}
                                            >


                                                <div className="profile-cover-camera-btn-div" onClick={handleSelectMedia}>
                                                    <BsFillCameraFill className='profile-cover-camera-btn' />
                                                </div>


                                                {item && item.VideoCover ?
                                                    (<video ref={videoRef} className="Profile-Cover-Video " autoPlay muted loop>
                                                        <source src={item && item.VideoCover} />
                                                    </video>)

                                                    :
                                                    null
                                                }


                                                <div id="Cover">
                                                    <div id="CoverCard">

                                                        <div className="Cover-card-bg">
                                                            <div className="cover-card-inner-div">
                                                                <div className='cover-close-div'>
                                                                    <IoMdClose onClick={off} style={{ fontSize: "24px" }} />
                                                                </div>


                                                                <label htmlFor="cover-img">

                                                                    {cover ? null : (
                                                                        <img className='Cover-img' style={{ cursor: "pointer" }} src={cover ? URL.createObjectURL(cover) : ("https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80")} alt="" />
                                                                    )}


                                                                    {cover ?

                                                                        (<>

                                                                            {cover && cover.type.startsWith('video/') ?

                                                                                (
                                                                                    <>

                                                                                        <div className="cover-object-video-div">
                                                                                            <video ref={videoRef} className="cover-video-objet ">
                                                                                                <source src={cover ? URL.createObjectURL(cover) : null} />
                                                                                            </video>
                                                                                        </div>

                                                                                    </>
                                                                                )
                                                                                :

                                                                                <img className='Cover-img' src={cover ? URL.createObjectURL(cover) : (imageUrl ? imageUrl : item.CoverPhoto)} alt="" />
                                                                            }

                                                                        </>)

                                                                        :

                                                                        (<>

                                                                            {item.CoverPhoto ? (
                                                                                <img className='Cover-img-Two' src={cover ? URL.createObjectURL(cover) : (imageUrl ? imageUrl : item.CoverPhoto)} alt="" />
                                                                            ) : null}



                                                                            {item.VideoCover ? (
                                                                                <div className="cover-object-video-div-Two">
                                                                                    <video ref={videoRef} className="cover-video-objet ">
                                                                                        <source src={item && item.VideoCover} />
                                                                                    </video>
                                                                                </div>
                                                                            ) : null}


                                                                        </>)

                                                                    }

                                                                </label>

                                                                <input type="file" id='cover-img' onChange={(e) => setCover(e.target.files[0])} style={{ display: "none" }} />

                                                                <div className='upload-btn-div'>
                                                                    <button className="btn-success-custom" onClick={CoverUpload}>Save</button>
                                                                </div>

                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>


                                                <div className="profile-pic-bg-div">

                                                    <div className="profile-pic-div-inner">
                                                        <div>
                                                            <div className="profile-pic-div" onClick={onProfile} style={{ backgroundImage: `url(${currentUser && currentUser.photoURL})` }}>

                                                            </div>
                                                        </div>

                                                        <div className='profile-pic-loading'>{loading ? (<CircularProgress style={{ fontSize: "16px" }} />) : ""}</div>

                                                        <div className="photo-edit-div" onClick={offProfile}>
                                                            <label htmlFor="profile-img">
                                                                <BsFillCameraFill className='photo-camera' />
                                                            </label>

                                                            <input type="button" id='profile-img' value="Select Image" style={{ display: "none" }} onClick={() => fileInput.current.click()} />

                                                            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div id='video-size' style={{ color: "Red", textAlign: "center" }}></div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </>

                )
                }


            </div>

        </>
    )
}

export default ProfileOne




// const CoverUpload = () => {
//     setLoading(true);
//     const imageRef = ref(storage, `images/${cover.name}`);
//     uploadBytes(imageRef, cover)
//         .then((snapshot) => {
//             console.log("Uploaded image successfully");
//             getDownloadURL(imageRef).then((url) => {
//                 setImageUrl(url);
//                 setDoc(profileDataRef, {
//                     CoverPhoto: url
//                 },
//                     { merge: true })
//                     .then(() => {
//                         console.log("Image URL added to Firestore");
//                         setLoading(false);
//                         off();
//                     })
//                     .catch((error) => {
//                         console.error("Error adding image URL to Firestore:", error);
//                         setLoading(false);
//                     });
//             });
//         })
//         .catch((error) => {
//             console.error("Error uploading image", error);
//             setLoading(false);
//         });
// };
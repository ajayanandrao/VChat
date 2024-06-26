import React, { useContext, useEffect, useRef, useState } from 'react';
import { db, storage } from './../../Firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { AuthContext } from './../../AuthContaxt';
import "./CreateStory.scss"
import { useNavigate } from 'react-router-dom';
import { AiFillHeart } from 'react-icons/ai';
import { BsFillChatFill, BsImages } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';



const CreateStorey = () => {
    const { currentUser } = useContext(AuthContext);
    const [stories, setStories] = useState([]);
    const [newStoryImage, setNewStoryImage] = useState(null);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

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

    const [progress, setProgress] = React.useState(0);

    function updateProgressBar(progress) {
        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = progress + "%";
        progressBar.setAttribute("aria-valuenow", progress);
    }

    const handleAddStory = async () => {
        if (!newStoryImage) {
            alert('Please select an image.');
            return;
        }

        // Clear the newStoryImage state after checking it to prevent double submissions.
        setNewStoryImage(null);

        const storiesCollection = collection(db, 'stories');
        let downloadURL;

        try {
            const querySnapshot = await getDocs(
                query(storiesCollection, where('uid', '==', currentUser.uid))
            );

            if (querySnapshot.size > 0) {
                const docRef = querySnapshot.docs[0].ref;

                // Compress the image before uploading.
                const compressedImgBlob = await compressImage(newStoryImage, 800);
                const storageRef = ref(storage, `story_images/${newStoryImage.name}`);

                const uploadTask = uploadBytesResumable(storageRef, compressedImgBlob);

                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(`Upload progress: ${progress}%`);
                    setProgress(progress);
                    updateProgressBar(progress);
                });

                await uploadTask;

                downloadURL = await getDownloadURL(storageRef);

                // Update the existing document with the compressed image.
                await updateDoc(docRef, {
                    image: downloadURL,
                    timestamp: serverTimestamp(),
                });

                // console.log('Image successfully uploaded');
            } else {
                const storageRef = ref(storage, `story_images/${newStoryImage.name}`);

                const uploadTask = uploadBytesResumable(storageRef, newStoryImage);

                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log(`Upload progress: ${progress}%`);
                    setProgress(progress);
                    updateProgressBar(progress);
                    // Show/hide a progress indicator based on the progress percentage.
                    if (progress < 100) {
                    } else {
                    }
                });

                await uploadTask;

                downloadURL = await getDownloadURL(storageRef);

                await addDoc(storiesCollection, {
                    name: newStoryImage ? newStoryImage.name : '',
                    image: newStoryImage ? downloadURL : '',
                    uid: currentUser && currentUser.uid,
                    photoUrl: currentUser.photoURL,
                    visible: true,
                    timestamp: serverTimestamp(),
                });

                // console.log('Video successfully uploaded');
                setProgress(0);
            }

            setStories([...stories, { image: downloadURL }]);
        } catch (error) {
            console.error('Error adding/updating story:', error);
        }
    };



    const deleteStory = async (storyId) => {
        try {
            const storyRef = doc(db, 'stories', storyId);
            const likesQuerySnapshot = await getDocs(
                collection(db, 'stories', storyId, 'likes')
            );
            const commentQuerySnapshot = await getDocs(
                collection(db, 'stories', storyId, 'comments')
            );

            // Delete the story
            await deleteDoc(storyRef);

            // Delete the corresponding likes
            likesQuerySnapshot.forEach(async (doc) => {
                const likeRef = doc.ref;
                await deleteDoc(likeRef);
            });
            commentQuerySnapshot.forEach(async (doc) => {
                const likeRef = doc.ref;
                await deleteDoc(likeRef);
            });
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    };

    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
        });

        return () => unsubscribe();
    }, []);

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

    const [comments, setComments] = useState([]);
    const fetchComments = async (storyId) => {
        try {
            const commentsCollection = collection(db, 'stories', storyId, 'comments');
            const querySnapshot = await getDocs(query(commentsCollection, orderBy('commentTime', 'desc')));
            const fetchedComments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setComments((prevComments) => [...prevComments, ...fetchedComments]);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    useEffect(() => {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, where('visible', '==', true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setStories(fetchedStories);
            fetchedStories.forEach((story) => {
                fetchComments(story.id);
                fetchLike(story.id);
            });
        });

        return () => unsubscribe();
    }, []);

    const [like, setLike] = useState([]);
    const fetchLike = async (storyId) => {
        try {
            const likeCollection = collection(db, 'stories', storyId, 'likes');
            const querySnapshot = await getDocs(query(likeCollection));
            const fetchLike = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setLike(fetchLike);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const filteredComments = comments.filter((item) => item.storyUid === currentUser.uid);
    const Like = like.filter((item) => currentUser.uid === item.storyUid);

    const [storyUid, setStoryUid] = useState(null);

    useEffect(() => {
        const sub = () => {
            const userStory = stories.find(item => item.uid === currentUser?.uid);
            if (userStory) {
                setStoryUid(userStory.uid);
            }
        };

        sub(); // Call the function immediately

        return () => {
            // Clean up code here if necessary
        };
    }, [currentUser, stories]);

    const [showLikes, setShowLikes] = useState(false);
    const HandleShowLike = () => {
        setShowLikes(!showLikes)
        if (showComment === true) {
            setShowComment(false);
        }

    }
    // Comment

    const [showComment, setShowComment] = useState(false);
    const HandleShowComment = () => {
        setShowComment(!showComment)
        if (showLikes === true) {
            setShowLikes(false);
        }

    }

    const handleReset = () => {
        if (newStoryImage !== null) {
            setNewStoryImage(null);
        }
    }

    useEffect(() => {
        const handleBeforeUnload = async () => {
            const PresenceRefOnline = doc(db, 'OnlyOnline', currentUser.uid);

            try {
                // Delete the document from Firestore
                await updateDoc(PresenceRefOnline, {
                    status: 'Offline',
                    presenceTime: new Date(),
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error('Error deleting PresenceRefOnline:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentUser && currentUser.uid]);


    return (
        <div className='cteateStory-main-container bg-light_0 dark:bg-dark'>

            <div className="progress">
                <div className="progress-bar" role="progressbar" style={{ width: `${progress}` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" id="progress-bar"></div>
            </div>

            <div className='d-flex justify-content-center'>
                {newStoryImage && newStoryImage.type.startsWith('image/') && (
                    <>
                        <img className="story-img-object" src={URL.createObjectURL(newStoryImage)} alt="" />
                    </>
                )}

                {newStoryImage && newStoryImage.type.startsWith('video/') && (
                    <div className="story-img-object">
                        <video ref={videoRef} onClick={handleClick} className="story-video-object ">
                            <source src={URL.createObjectURL(newStoryImage)} type={newStoryImage.type} />
                        </video>
                    </div>
                )}
            </div>

            {storyUid ?

                (
                    <>
                        <div className='story-div'>
                            {stories.map((story) => {

                                if (story.uid === currentUser.uid) {
                                    return (
                                        <div key={story.id}>
                                            {story.image && story.image.includes('.mp4') ? (
                                                <div className="story-video-container">
                                                    <div className='story-video-div'>
                                                        {showLikes ? (
                                                            <div className="userLikes-div">
                                                                <div>
                                                                    <div>
                                                                        {like.map((like) => {
                                                                            return (
                                                                                <div className=''>
                                                                                    <div className="liked-user-profile">
                                                                                        <div>
                                                                                            <img className="liked-user-profile-img" src={like.photoURL} alt="" />
                                                                                        </div>
                                                                                        <div>{like.name}</div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                            :
                                                            null}

                                                        {showComment ? (
                                                            <div className="userLikes-div">
                                                                <div>
                                                                    <div>
                                                                        {filteredComments.map((comment) => {
                                                                            return (
                                                                                <div className='d-flex' key={comment.id}>
                                                                                    <div className="commented-user-profile">
                                                                                        <div>
                                                                                            <img src={comment.photoURL} className="liked-user-profile-img" alt="" />
                                                                                        </div>
                                                                                        <div>{comment.comment}</div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                            :
                                                            null}

                                                        <video ref={videoRef} onClick={handleClick} className="story-video" id="video" autoPlay>
                                                            <source src={story.image} type="video/mp4" />
                                                        </video>

                                                        <div className="story-like-div" onClick={() => HandleShowLike()}>
                                                            <div className='mx-2' style={{ color: "white", fontSize: "14px" }} >
                                                                {Like.length}
                                                            </div>
                                                            <AiFillHeart style={{ color: "red", fontSize: "24px" }} />
                                                        </div>

                                                        <div className="story-comment-div" onClick={() => HandleShowComment()}>
                                                            <div className='mx-2' style={{ color: "white", fontSize: "14px" }} >
                                                                {filteredComments.length}
                                                            </div>
                                                            <BsFillChatFill style={{ color: "#FFFFFF", fontSize: "24px" }} />
                                                        </div>
                                                        <div className="story-delete-div" onClick={() => { deleteStory(story.id); goBack(); }}>
                                                            <MdDelete style={{ color: "#FFFFFF", fontSize: "24px" }} />
                                                        </div>


                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='story-img-div-wrapper'>
                                                    <div className='story-img-div'>

                                                        {showLikes ? (
                                                            <div className="userLikes-div">
                                                                <div>
                                                                    <div>
                                                                        {like.map((like) => {
                                                                            return (
                                                                                <div className=''>
                                                                                    <div className="liked-user-profile">
                                                                                        <div>
                                                                                            <img className="liked-user-profile-img" src={like.photoURL} alt="" />
                                                                                        </div>
                                                                                        <div>{like.name}</div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                            :
                                                            null}

                                                        {showComment ? (
                                                            <div className="userLikes-div">
                                                                <div>
                                                                    <div>
                                                                        {filteredComments.map((comment) => {
                                                                            return (
                                                                                <div className='d-flex' key={comment.id}>
                                                                                    <div className="commented-user-profile">
                                                                                        <div>
                                                                                            <img src={comment.photoURL} className="liked-user-profile-img" alt="" />
                                                                                        </div>
                                                                                        <div>{comment.comment}</div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                            :
                                                            null}




                                                        <img src={story.image} className='story-img' alt="Story" />

                                                        <div className="story-like-div" onClick={() => HandleShowLike()}>
                                                            <div className='mx-2' style={{ color: "white", fontSize: "14px" }} >
                                                                {Like.length}
                                                            </div>
                                                            <AiFillHeart style={{ color: "red", fontSize: "24px" }} />
                                                        </div>

                                                        <div className="story-comment-div" onClick={() => HandleShowComment()}>
                                                            <div className='mx-2' style={{ color: "white", fontSize: "14px" }} >
                                                                {filteredComments.length}
                                                            </div>
                                                            <BsFillChatFill style={{ color: "#FFFFFF", fontSize: "24px" }} />
                                                        </div>
                                                        <div className="story-delete-div" onClick={() => { deleteStory(story.id); goBack(); }}>
                                                            <MdDelete style={{ color: "#FFFFFF", fontSize: "24px" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            })}
                        </div>

                    </>
                )
                :
                (<>
                    <div className='story-mainu'>
                        <input
                            style={{ display: "none" }}
                            className='my-2 story-add-input'
                            id='Add-story'
                            type="file"
                            onChange={(e) => setNewStoryImage(e.target.files[0])}
                            accept="image/*, video/*"
                        />

                        <div className='btn-inline'>
                            <label htmlFor="Add-story" onClick={handleReset}>
                                <div className='folder '>
                                    <BsImages className='text-lightProfileName dark:text-darkProfileName' />
                                </div>
                            </label>
                            <button className='ms-3 btn-primary-custom' onClick={handleAddStory}>
                                Add Story
                            </button>

                        </div>
                    </div>
                </>)}

        </div>
    );
};

export default CreateStorey;

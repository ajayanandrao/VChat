import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db, storage } from '../../Firebase';
import { CircularProgress } from '@mui/material';
import "./Messages.scss";
import { MdClose, MdDelete, MdOutlineReply, MdSend } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
import { BsFillCameraFill, BsThreeDots } from 'react-icons/bs';
import { AuthContext } from '../../AuthContaxt';
import { IoMdClose } from "react-icons/io"
import { BiSend, BiSolidSend } from "react-icons/bi"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

const Messages = () => {
    const { currentUser } = useContext(AuthContext);
    const senderId = currentUser && currentUser.uid;
    const { id } = useParams();
    const videoRef = useRef(null);
    const messageListRef = useRef(null);
    const nav = useNavigate();


    // @@@@@@@@@@ useState @@@@@@@@@@ // @@@@@@@@@@ useState @@@@@@@@@@ 

    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);

    const [messageInput, setMessageInput] = useState("");

    const [replyInput, setReplyInput] = useState("");

    const [selectedMessageId, setSelectedMessageId] = useState("");

    const [hoveredMessageId, setHoveredMessageId] = useState('');
    const [img, setImg] = useState(null);



    // @@@@@@@@@@ useEffect @@@@@@@@@@ // @@@@@@@@@@ useEffect @@@@@@@@@@
    useEffect(() => {
        messageListRef.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        const messagesRef = collection(db, 'messages');

        if (user && id) {
            const q = query(
                messagesRef,
                where('sender', 'in', [senderId, user.uid]),
                where('recipient', 'in', [senderId, user.uid]),
                orderBy('timestamp', 'asc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMessages(messages);
            });

            return () => unsubscribe();
        }
    }, [senderId, user, id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'UpdateProfile', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUser({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);


    const goBack = () => {
        nav(-1);
    }

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                video.pause();
            } else {
                video.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const [MessagePhoto, setMessagePhoto] = useState(null);
    const [MessagePhotoid, setMessagePhotoId] = useState("");
    const [photoTime, setPhotoTime] = useState("");

    const ViewMessageImg = (id, photo, time) => {
        setMessagePhoto(photo);
        setMessagePhotoId(id);
        setPhotoTime(time);
    };

    // =====================================

    // if (selectedMessageId !== "") {
    //     const x = document.getElementById("view");
    //     if (x.style.display == "none") {
    //         x.style.display = "flex";
    //     }
    // }

    const hideX = () => {
        const x = document.getElementById("view");
        if (x.style.display == "none") {
            x.style.display = "flex";
        } else {
            x.style.display = "none";
        }
    }


    const [deleteMessagePhoto, setDeleteMessagePhoto] = useState(false);
    const [deleteMediaId, setDeleteMediaId] = useState(null);
    const DeleteMedaiOverlay = (id) => {
        setDeleteMediaId(id);
        setDeleteMessagePhoto(!deleteMessagePhoto);
    };


    const [isPlaying, setIsPlaying] = useState(false);


    const [viewMessageInput, setViewMessageInput] = useState("");
    const [viewMessageImg, setViewMessageImg] = useState(null);



    const [viewReplyVideoUrl, setViewReplyVideoUrl] = useState(null);


    const [selectedLikeMessage, setSelectedLikeMessage] = useState(false);
    const [viewReplyImgLikeUrl, setViewReplyImgLikeUrl] = useState(null);


    const [showReplyVideoUrl, setShowReplyVideoUrl] = useState(null);
    const [showReplyVideoDiv, setReplyVideoDiv] = useState(false);
    const [showReplyVideoID, setReplyVideoId] = useState("");
    const [showReplyVideoTime, setshowReplyVideoTime] = useState(null);

    if (viewReplyImgLikeUrl != null) {
        // hideX();
        setSelectedMessageId("");
        setViewMessageInput("");
        setViewMessageImg(null);
        setViewReplyImgLikeUrl(null);
    }


    const showReplyButton = (messageId) => {
        setHoveredMessageId(messageId);
    };

    const hideReplyButton = () => {
        setHoveredMessageId('');
    };


    function formatTimestamp(timestamp) {
        const date = timestamp.toDate();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
    }

    function PhotoFormatTimestamp(timestamp) {
        const date = photoTime.toDate();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
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

    const sendMessage = async (uid, name, recipientImg) => {


        try {
            const messagesRef = collection(db, 'messages');
            const currentUser = auth.currentUser;

            // Prepare the new message object
            const newMessage = {
                sender: currentUser.uid,
                senderImg: currentUser.photoURL,
                recipient: uid,
                recipientImg: recipientImg,
                timestamp: serverTimestamp(),
            };

            if (messageInput) {
                newMessage.message = messageInput;
                setMessageInput(""); // Clear the message input field
            }

            if (img) {
                if (img.type.startsWith('image/')) {
                    const compressedImgBlob = await compressImage(img, 800);

                    const storageRef = ref(storage, `messageImages/${img.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, compressedImgBlob);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload progress: ' + progress + '%');
                            if (progress < 100) {
                                document.getElementById("progress").style.display = "block";
                            } else {
                                setImg(null);
                                document.getElementById("progress").style.display = "none";
                            }
                        },
                        (error) => {
                            console.error('Upload error:', error);
                        },
                        async () => {
                            try {
                                const imageUrl = await getDownloadURL(storageRef);
                                newMessage.imageUrl = imageUrl;
                                await addDoc(messagesRef, newMessage);
                            } catch (error) {
                                console.error('Error uploading image:', error);
                            }
                        }
                    );
                } else if (img.type.startsWith('video/')) {
                    const storageRef = ref(storage, 'messageVideos/' + v4());
                    const uploadTask = uploadBytesResumable(storageRef, img);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = Math.round(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            );
                            console.log('Upload progress:', progress);
                            setLoadingProgress(progress);
                            if (progress == 100) {
                                setImg(null);
                                setLoadingProgress(false);
                                setIsPlaying(false);
                            }
                            if (progress < 100) {
                                document.getElementById('p1').style.display = 'block';
                            } else {
                                document.getElementById('p1').style.display = 'none';
                            }
                        },
                        (error) => {
                            console.error('Error uploading video:', error);
                        },
                        async () => {
                            try {
                                const videoUrl = await getDownloadURL(storageRef);
                                newMessage.videoUrl = videoUrl;
                                await addDoc(messagesRef, newMessage);
                            } catch (error) {
                                console.error('Error uploading video:', error);
                            }
                        }
                    );
                }
            } else if (newMessage.message) {
                await addDoc(messagesRef, newMessage);
            }

            // Update sender's and recipient's friend lists
            await Promise.all([
                addDoc(collection(db, `allFriends/${uid}/Message`), {
                    userId: currentUser.uid,
                    name: currentUser.displayName,
                    photoUrl: currentUser.photoURL,
                    time: serverTimestamp(),
                }),
                addDoc(collection(db, `allFriends/${currentUser.uid}/Message`), {
                    userId: uid,
                    name: name,
                    photoUrl: recipientImg,
                    time: serverTimestamp(),
                }),
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const deleteMessage = async (messageId) => {
        console.log(messageId);
        const messageRef = doc(db, 'messages', messageId);
        await deleteDoc(messageRef);
    };

    // const deleteMessage = async (messageId) => {
    //     try {
    //         const messageRef = doc(db, 'messages', messageId);

    //         // Mark the message as deleted by the sender
    //         await updateDoc(messageRef, { isDeletedBySender: true, deletedBySender: currentUser.uid });

    //         console.log("Message deleted successfully!");
    //     } catch (error) {
    //         console.error("Error deleting message:", error);
    //     }
    // };

    const deleteFromMessageList = async () => {
        const CurrentFriendRef = collection(db, `allFriends/${currentUser && currentUser.uid}/Message`);
        const Query = query(CurrentFriendRef, where('userId', '==', user && user.uid));
        // console.log(user);
        // console.log(userId);
        console.log(user.uid);
        console.log(currentUser.uid);
        try {
            const querySnapshot = await getDocs(Query);

            querySnapshot.forEach(async (doc) => {
                // console.log('Found user ID:', doc.data().userId);

                try {
                    await deleteDoc(doc.ref); // Use doc.ref to get the document reference
                    console.log('Current User Message Deleted.');
                } catch (deleteError) {
                    console.error('Error deleting friend:', deleteError);
                }
                if (querySnapshot.size === 0) {
                    console.log('Friend not found');
                }

            });
        } catch (error) {
            console.error('Error getting documents:', error);
        }

        // ==========================================================

        const friendsRef = collection(db, `allFriends/${user && user.uid}/Message`);
        const friendsQuery = query(friendsRef, where('userId', '==', currentUser.uid));

        try {
            const querySnapshot = await getDocs(friendsQuery);

            querySnapshot.forEach(async (doc) => {
                // console.log('Found user ID:', doc.data().userId);

                try {
                    await deleteDoc(doc.ref); // Use doc.ref to get the document reference
                    console.log('User Message Deleted.');
                } catch (deleteError) {
                    console.error('Error deleting friend:', deleteError);
                }
                if (querySnapshot.size === 0) {
                    console.log('Friend not found');
                }

            });
        } catch (error) {
            console.error('Error getting documents:', error);
        }
    };

    const deleteMessagesForUser = async (userId) => {
        try {
            const messagesRef = collection(db, 'messages');
            const userMessagesQuery = query(messagesRef,
                where('sender', 'in', [currentUser.uid, user.uid]),
                where('recipient', 'in', [currentUser.uid, user.uid]));
            const userMessagesSnapshot = await getDocs(userMessagesQuery);

            const batch = writeBatch(db);

            userMessagesSnapshot.forEach((messageDoc) => {
                batch.delete(messageDoc.ref);
            });

            await batch.commit();
            console.log("User's messages deleted successfully!");
        } catch (error) {
            console.error("Error deleting user's messages:", error);
        }



    };

    const deleteMessagesForCurrentUser = async (userId) => {
        try {
            const messagesRef = collection(db, 'messages');
            const userMessagesQuery = query(
                messagesRef,
                where('sender', 'in', [currentUser.uid, user.uid]),
                where('recipient', 'in', [currentUser.uid, user.uid])
            );
            const userMessagesSnapshot = await getDocs(userMessagesQuery);

            const batch = writeBatch(db);

            userMessagesSnapshot.forEach((messageDoc) => {
                const messageRef = doc(db, 'messages', messageDoc.id);
                batch.update(messageRef, {
                    isDeletedBySender: true,
                    deletedBySender: currentUser.uid
                });
            });

            await batch.commit();
            console.log("User's messages marked as deleted by sender!");
        } catch (error) {
            console.error("Error marking user's messages as deleted by sender:", error);
        }
    };


    const [showMessageOption, setShowMessageOption] = useState(false);
    const HandleShowMessageOption = () => {
        setShowMessageOption(!showMessageOption);
    }

    const [areYouSure, setAreYouSure] = useState(false);
    const HandleAreyouSure = () => {
        setAreYouSure(!areYouSure);
    }
    const [areYouSureForCurrentUser, setAreYouSureForCurrentUser] = useState(false);
    const HandleAreyouSureForCurrentUser = () => {
        setAreYouSureForCurrentUser(!areYouSureForCurrentUser);
    }



    // Usage example:
    // Call this function when you want to delete all messages for a specific user
    // deleteMessagesForUser(userId);


    // Render the UI component

    const sendReply = async (messageId) => {
        const selectedMessage = messages.find((message) => message.id === messageId);
        setMessageInput("");
        // setViewMessageImg(null);
        setViewMessageInput(null);
        setViewReplyImgUrl(null);
        setViewReplyVideoUrl(null);


        const messagesRef = collection(db, 'messages');
        if (selectedMessage && selectedMessage.sender) {
            let replyContent = `Reply: ${selectedMessage.message || ""}`;

            if (selectedMessage.imageUrl) {
                replyContent = `Reply to: ${selectedMessage.imageUrl}`;
            }

            if (selectedMessage.videoUrl) {
                replyContent = `Reply to video: ${selectedMessage.videoUrl}`;
            }

            // Create a new document using `addDoc` function
            const newMessage = {
                sender: currentUser.uid, // Set the sender's ID
                recipient: selectedMessage.sender, // Set the recipient's ID
                message: messageInput, // Set the message content
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
                reply: replyContent,
            };

            await addDoc(messagesRef, newMessage);
        }

        setSelectedMessageId("");

    };

    const SendLike = async (uid, name, recipientImg) => {
        if (senderId) {
            const messagesRef = collection(db, 'messages');
            const content = replyInput || messageInput;
            // Create a new document using `addDoc` function
            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,

                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                imageUrlLike: "https://cdn3d.iconscout.com/3d/premium/thumb/like-gesture-4158696-3449626.png?f=webp",
                // imageUrlLike: "https://cdn3d.iconscout.com/3d/premium/thumb/like-hand-gesture-6580722-5526788.png?f=webp",
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });
        }
    }

    // e.preventDefault();

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., new line)
            if (selectedMessageId) {
                sendReply(selectedMessageId);
                setSelectedMessageId("");
                setViewMessageImg(null);
                setViewMessageInput("");

                setViewMessageImg(null);
                setMessagePhoto(null);
                setShowReplyVideoUrl(null);

            } else {
                // hideX();
                sendMessage(user.uid, user.name, user.userPhoto);
            }
        }
    };


    // message video functions @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2

    const [viewVideoDiv, setViewVideoDiv] = useState(false);
    const [videoId, SetVideoId] = useState(null);
    const [videoUrl, SetVideoUrl] = useState(null);
    const [messageVideoTime, setMessageVideoTime] = useState("");
    const [loadingProgress, setLoadingProgress] = useState("");

    function MessageVideoFormatTimestamp(timestamp) {
        const date = messageVideoTime.toDate();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
    }

    const handleVewVideo = (id, url, time) => {
        setViewVideoDiv(!viewVideoDiv);
        SetVideoId(id);
        SetVideoUrl(url);
        setMessageVideoTime(time);
    };

    const DeleteVideo = async (id) => {
        setDeleteMessagePhoto(false);
        setViewVideoDiv(false);
        setReplyVideoDiv(false);
        console.log(id);
        const messageRef = doc(db, 'messages', deleteMediaId);
        await deleteDoc(messageRef);
        setDeleteMediaId(null);
    };

    // END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    const HandleShowReplyVdieo = (id, url, time) => {
        console.log(id);
        setReplyVideoId(id);
        setReplyVideoDiv(!showReplyVideoDiv)
        setShowReplyVideoUrl(url);
        setReplyImgTime(time);
    }

    const Delete_Photo_Video = async () => {

        setDeleteMessagePhoto(false);
        setReplyVideoDiv(false); //view video div none
        setShowReplyVideoUrl(null); //set video url none


        setViewReplyImgState(false); // view image div none
        setMessagePhoto(null); // set photo none

        const messageRef = doc(db, 'messages', deleteMediaId);
        await deleteDoc(messageRef);

        setDeleteMediaId(null);
    };

    const [viewReplyImgState, setViewReplyImgState] = useState(false);
    const [replyImgid, setReplyImgid] = useState("");
    const [viewReplyImgUrl, setViewReplyImgUrl] = useState(null);
    const [replyImgTime, setReplyImgTime] = useState("");


    function ReplyPhotoFormatTimestamp(timestamp) {
        const date = replyImgTime.toDate();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
    }


    if (!user) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' />
            </div >
        </>;
    }

    return (
        <Fragment>
            <div className="message-main-div">



                {/* Delete Message Permantly ------------------------------------- */}

                {areYouSure &&
                    <div className="are-you-sure-div">
                        <div className="are-you-sure-inner-div">
                            <p>Are you sure?</p>
                            <p>This will Delete messagess permanently for avery one</p>
                            <div className="are-you-sure-btn-div">
                                <button className='btn-D-custom' onClick={() => { deleteMessagesForUser(); deleteFromMessageList(); HandleAreyouSure(); HandleShowMessageOption(); }}>Delete</button>
                                <button className='btn-info-custom'
                                    onClick={() => { HandleAreyouSure(); HandleShowMessageOption(); }}
                                    style={{ background: "#FAFAFA", color: "#0080FF" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                {areYouSureForCurrentUser &&
                    <div className="are-you-sure-div">
                        <div className="are-you-sure-inner-div">
                            <p>Are you sure?</p>
                            <p>This will gonna Clear your message Box</p>
                            <div className="are-you-sure-btn-div">
                                <button className='btn-D-custom' onClick={() => { deleteMessagesForCurrentUser(); HandleAreyouSureForCurrentUser(); HandleShowMessageOption(); }}>Delete</button>
                                <button className='btn-info-custom'
                                    onClick={() => { HandleAreyouSureForCurrentUser(); HandleShowMessageOption(); }}
                                    style={{ background: "#FAFAFA", color: "#0080FF" }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }

                {/* Media View ------------------------------------- */}


                {/* Message Photo View ------------------------------------- */}

                {MessagePhoto &&
                    <div className='media-div'>
                        <div className="media-div-inner">

                            {deleteMessagePhoto && <>

                                <div className='deleteMessagePhoto-div'>
                                    <div className="deleteMessagePhoto-div-inner">
                                        <div>This will Delete the message for everyone.</div>
                                        <div className='my-4'>
                                            <button className='btn btn-sm btn-danger mx-4' onClick={Delete_Photo_Video}>Delete</button>
                                            <button className='btn btn-sm btn-secondary mx-4' onClick={DeleteMedaiOverlay}>Cancle</button>
                                        </div>
                                    </div>
                                </div>
                            </>}

                            <div className="media-option-div">

                                <div className="media-delete-div">
                                    <div className="media-time"> {PhotoFormatTimestamp(photoTime)}</div>
                                    <MdDelete onClick={() => DeleteMedaiOverlay(MessagePhotoid)} style={{ fontSize: "24px" }} className='photo-delete' />
                                </div>

                                <div className="media-close-div">
                                    <div className="media-close-btn">
                                        <IoMdClose onClick={() => setMessagePhoto(null)} className='media-close-icon' />
                                    </div>
                                </div>
                            </div>

                            <div className="media-img-div">
                                <img src={MessagePhoto} className='photo-img' alt="" />
                            </div>


                        </div>
                    </div>
                }

                {/* End ------------------------------------- */}

                {/* Message Video View ------------------------------------- */}

                {viewVideoDiv &&
                    <div className='media-div'>
                        <div className="media-div-inner">

                            {deleteMessagePhoto && <>

                                <div className='deleteMessagePhoto-div'>
                                    <div className="deleteMessagePhoto-div-inner">
                                        <div>This will Delete the message for everyone.</div>
                                        <div className='my-4'>
                                            <button className='btn btn-sm btn-danger mx-4' onClick={DeleteVideo}>Delete</button>
                                            <button className='btn btn-sm btn-secondary mx-4' onClick={DeleteMedaiOverlay}>Cancle</button>
                                        </div>
                                    </div>
                                </div>
                            </>}

                            <div className="media-option-div">

                                <div className="media-delete-div">
                                    <div className="media-time"> {MessageVideoFormatTimestamp(messageVideoTime)}</div>
                                    <MdDelete onClick={() => DeleteMedaiOverlay(videoId)} style={{ fontSize: "24px" }} className='photo-delete' />
                                    {/* <MdDelete onClick={() => DeleteVideo(videoId)} style={{ fontSize: "24px" }} className='photo-delete' /> */}
                                </div>

                                <div className="media-close-div">
                                    <div className="media-close-btn">
                                        <IoMdClose onClick={() => { SetVideoUrl(null); setViewVideoDiv(false) }} className='media-close-icon' />
                                    </div>
                                </div>
                            </div>

                            <div className="media-img-div">
                                <video ref={videoRef} controls className=" viewVideoClass" >
                                    <source src={videoUrl} />
                                </video>

                            </div>


                        </div>
                    </div>
                }

                {/* End ------------------------------------- */}

                {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Reply Media View @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2 */}



                {showReplyVideoDiv &&
                    <div className='media-div'>
                        <div className="media-div-inner">

                            {deleteMessagePhoto && <>

                                <div className='deleteMessagePhoto-div'>
                                    <div className="deleteMessagePhoto-div-inner">
                                        <div>This will Delete the message for everyone.</div>
                                        <div className='my-4'>
                                            <button className='btn btn-sm btn-danger mx-4' onClick={DeleteVideo}>Delete</button>
                                            <button className='btn btn-sm btn-secondary mx-4' onClick={DeleteMedaiOverlay}>Cancle</button>
                                        </div>
                                    </div>
                                </div>
                            </>}

                            <div className="media-option-div">

                                <div className="media-delete-div">
                                    <div className="media-time"> {ReplyPhotoFormatTimestamp(replyImgTime)}</div>
                                    <MdDelete onClick={() => DeleteMedaiOverlay(showReplyVideoID)} style={{ fontSize: "24px" }} className='photo-delete' />
                                </div>

                                <div className="media-close-div">
                                    <div className="media-close-btn">
                                        <IoMdClose onClick={() => { setReplyVideoDiv(false) }} className='media-close-icon' />
                                    </div>
                                </div>
                            </div>

                            <div className="media-img-div">

                                {showReplyVideoUrl.split("Reply to video: ")[1] ?

                                    <div className="media-img-div"  >
                                        <video ref={videoRef} controls className=" viewVideoClass" >
                                            <source src={showReplyVideoUrl.split("Reply to video: ")[1]} />
                                        </video>

                                    </div>

                                    :

                                    <div className="media-img-div">
                                        <img src={showReplyVideoUrl.split("Reply to: ")[1]} className='photo-img' alt="" />
                                    </div>
                                }


                            </div>


                        </div>
                    </div>
                }


                {/* Profile  ------------------------------------- */}

                <div className="message-top-bar">
                    <i onClick={goBack} className="bi bi-arrow-left message-back-arrow "></i>

                    <div className="message-profile-div">
                        <img className='message-profile-img' src={user.userPhoto} alt="" />
                        <span className='message-profile-name'>{user.name}</span>
                        {/* <button className='btn btn-sm btn-danger ms-3' onClick={deleteMessagesForUser}>Clear Chat</button> */}
                    </div>
                    <div>
                        {showMessageOption ?
                            <div className="top-message-option-btn"
                                style={{ background: "#f0f2f5", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                                onClick={HandleShowMessageOption}>
                                <BsThreeDots />
                            </div>
                            :
                            <div className="top-message-option-btn" onClick={HandleShowMessageOption}>
                                <BsThreeDots />
                            </div>

                        }
                        {showMessageOption ?
                            <div className="show-message-option">
                                <p onClick={HandleAreyouSure}>Delete all Chat</p>
                                <p onClick={HandleAreyouSureForCurrentUser}>Delete message from you</p>
                            </div>
                            :
                            null
                        }

                    </div>
                </div>
                {/* Center div ------------------------------------- */}



                <div className="message-center-div">

                    <div className="message-center-container">

                        <div style={{ width: "100%" }}>
                            {/* width 100% for message layout */}

                            {messages.map((message, index) => {
                                const isSender = message.sender === currentUser.uid;
                                const isDeletedBySender = message.isDeletedBySender || false;
                                const deletedBySenderUid = message.deletedBySender === currentUser.uid;
                                if (
                                    (message.sender === currentUser.uid && message.recipient === user.uid) ||
                                    (message.sender === user.uid && message.recipient === currentUser.uid)
                                ) {
                                    const isSender = message.sender === currentUser.uid;
                                    const messageClass = isSender ? 'sender' : 'user';
                                    const isRecipient = message.recipient === user.uid;
                                    const hasImage = !!message.imageUrl; // Check if message has an imageUrl
                                    const hasVideo = !!message.videoUrl; // Check if message has an imageUrl
                                    const hasImageLike = !!message.imageUrlLike; // Check if message has an imageUrl.

                                    return (
                                        <>
                                            <div
                                                key={message.id}
                                                className={`message-item ${messageClass}`}
                                            >
                                                {isSender && hoveredMessageId === message.id && (
                                                    <div>
                                                        <div
                                                            className="delete-button"
                                                            onClick={() => {
                                                                deleteMessage(message.id);
                                                            }}
                                                        >
                                                            <i className="bi bi-x-circle-fill"></i>
                                                        </div>
                                                    </div>
                                                )}

                                                <div
                                                    className={`message-bubble ${isSender ? 'message-sender' : 'message-recipient'} ${hasImage || hasVideo || hasImageLike ? 'has-image' : '' /* Add 'has-image' class when message has an image */
                                                        }`}>



                                                    {isDeletedBySender ?

                                                        (<>
                                                            {deletedBySenderUid ?
                                                                (
                                                                    null

                                                                )
                                                                :

                                                                (<>
                                                                    (<>

                                                                        {!isSender && <div> <img className="message-img" src={user.userPhoto} alt="Sender" /> </div>}

                                                                        <div>
                                                                            {hasImageLike ?
                                                                                ""
                                                                                :
                                                                                <>
                                                                                    {isSender && hoveredMessageId === message.id && (
                                                                                        <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}</div>
                                                                                    )}
                                                                                </>
                                                                            }

                                                                            {/* {message.reply && <div className="message-reply">{message.reply}</div>} */}

                                                                            {message.reply && (
                                                                                <div className="message-reply">
                                                                                    {(message.reply.startsWith("Reply to: ") || message.reply.includes("Reply to video: ")) ? (
                                                                                        <>
                                                                                            <div style={{
                                                                                                display: "flex",
                                                                                                justifyContent: "center",
                                                                                                width: "100%", borderRadius: "0.5rem"
                                                                                            }}
                                                                                                onClick={() => HandleShowReplyVdieo(message.id, message.reply, message.timestamp)}
                                                                                            >
                                                                                                {message.reply.includes("Reply to video: ") && (

                                                                                                    <div className="message-video-container">

                                                                                                        <video ref={videoRef} className="video messageVideo">
                                                                                                            <source src={message.reply.split("Reply to video: ")[1]} />
                                                                                                        </video>
                                                                                                        <div className="message-play-button">
                                                                                                            <div className="message-play-btn-div">
                                                                                                                <i className="bi bi-play-fill message-play-btn"></i>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}

                                                                                                {message.reply.includes("Reply to: ") && (
                                                                                                    <img src={message.reply.split("Reply to: ")[1]}
                                                                                                        alt="Replied Image"
                                                                                                        style={{
                                                                                                            width: "100px", height: "150px", objectFit: "cover",
                                                                                                            objectPosition: "center",
                                                                                                            borderRadius: "0.5rem"
                                                                                                        }}
                                                                                                        className="replied-image"
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div style={{ display: "inline-flex", lineHeight: "0px" }}>
                                                                                            <p >{message.reply}</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}



                                                                            {!isSender && hoveredMessageId === message.id && (
                                                                                <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}</div>
                                                                            )}


                                                                            {hasImage &&
                                                                                <div
                                                                                    onMouseEnter={() => showReplyButton(message.id)}
                                                                                    onMouseLeave={hideReplyButton}>
                                                                                    <img onClick={() => ViewMessageImg(message.id, message.imageUrl, message && message.timestamp)} src={message.imageUrl}
                                                                                        className='messageImg' alt="Message" />
                                                                                </div>
                                                                            }

                                                                            {hasVideo &&
                                                                                <div onClick={() => handleVewVideo(message.id, message.videoUrl, message && message.timestamp)}
                                                                                    onMouseEnter={() => showReplyButton(message.id)}
                                                                                    onMouseLeave={hideReplyButton}
                                                                                >
                                                                                    <div className="message-video-container" >

                                                                                        <video ref={videoRef} className="video messageVideo">
                                                                                            <source src={message.videoUrl} />
                                                                                        </video>
                                                                                        <div className="message-play-button">
                                                                                            <div className="message-play-btn-div">
                                                                                                <i className="bi bi-play-fill message-play-btn"></i>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            }

                                                                            {hasImageLike &&
                                                                                <div className='messageImgLike-div' onMouseEnter={() => showReplyButton(message.id)}
                                                                                    onMouseLeave={hideReplyButton}>
                                                                                    <img src={message.imageUrlLike}
                                                                                        className='messageImgLike' alt="Message" />
                                                                                </div>
                                                                            }



                                                                            {message.message && <div className="message-content"
                                                                                onMouseEnter={() => showReplyButton(message.id)}
                                                                                onMouseLeave={hideReplyButton}
                                                                            >{message.message}</div>}


                                                                        </div>
                                                                    </>)
                                                                </>)
                                                            }

                                                        </>)

                                                        :

                                                        (<>

                                                            {!isSender && <div> <img className="message-img" src={user.userPhoto} alt="Sender" /> </div>}

                                                            <div>
                                                                {hasImageLike ?
                                                                    ""
                                                                    :
                                                                    <>
                                                                        {isSender && hoveredMessageId === message.id && (
                                                                            <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}</div>
                                                                        )}
                                                                    </>
                                                                }

                                                                {/* {message.reply && <div className="message-reply">{message.reply}</div>} */}

                                                                {message.reply && (
                                                                    <div className="message-reply">
                                                                        {(message.reply.startsWith("Reply to: ") || message.reply.includes("Reply to video: ")) ? (
                                                                            <>
                                                                                <div style={{
                                                                                    display: "flex",
                                                                                    justifyContent: "center",
                                                                                    width: "100%", borderRadius: "0.5rem"
                                                                                }}
                                                                                    onClick={() => HandleShowReplyVdieo(message.id, message.reply, message.timestamp)}
                                                                                >
                                                                                    {message.reply.includes("Reply to video: ") && (

                                                                                        <div className="message-video-container">

                                                                                            <video ref={videoRef} className="video messageVideo">
                                                                                                <source src={message.reply.split("Reply to video: ")[1]} />
                                                                                            </video>
                                                                                            <div className="message-play-button">
                                                                                                <div className="message-play-btn-div">
                                                                                                    <i className="bi bi-play-fill message-play-btn"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {message.reply.includes("Reply to: ") && (
                                                                                        <img src={message.reply.split("Reply to: ")[1]}
                                                                                            alt="Replied Image"
                                                                                            style={{
                                                                                                width: "100px", height: "150px", objectFit: "cover",
                                                                                                objectPosition: "center",
                                                                                                borderRadius: "0.5rem"
                                                                                            }}
                                                                                            className="replied-image"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div style={{ display: "inline-flex", lineHeight: "0px" }}>
                                                                                <p >{message.reply}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}



                                                                {!isSender && hoveredMessageId === message.id && (
                                                                    <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}</div>
                                                                )}


                                                                {hasImage &&
                                                                    <div
                                                                        onMouseEnter={() => showReplyButton(message.id)}
                                                                        onMouseLeave={hideReplyButton}>
                                                                        <img onClick={() => ViewMessageImg(message.id, message.imageUrl, message && message.timestamp)} src={message.imageUrl}
                                                                            className='messageImg' alt="Message" />
                                                                    </div>
                                                                }

                                                                {hasVideo &&
                                                                    <div onClick={() => handleVewVideo(message.id, message.videoUrl, message && message.timestamp)}
                                                                        onMouseEnter={() => showReplyButton(message.id)}
                                                                        onMouseLeave={hideReplyButton}
                                                                    >
                                                                        <div className="message-video-container" >

                                                                            <video ref={videoRef} className="video messageVideo">
                                                                                <source src={message.videoUrl} />
                                                                            </video>
                                                                            <div className="message-play-button">
                                                                                <div className="message-play-btn-div">
                                                                                    <i className="bi bi-play-fill message-play-btn"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }

                                                                {hasImageLike &&
                                                                    <div className='messageImgLike-div' onMouseEnter={() => showReplyButton(message.id)}
                                                                        onMouseLeave={hideReplyButton}>
                                                                        <img src={message.imageUrlLike}
                                                                            className='messageImgLike' alt="Message" />
                                                                    </div>
                                                                }



                                                                {message.message && <div className="message-content"
                                                                    onMouseEnter={() => showReplyButton(message.id)}
                                                                    onMouseLeave={hideReplyButton}
                                                                >{message.message}</div>}


                                                            </div>
                                                        </>)
                                                    }


                                                </div>

                                                {!isSender && hoveredMessageId === message.id && (
                                                    <div>
                                                        <div
                                                            className="reply-button"
                                                            onClick={() => {


                                                                setSelectedMessageId(message.id);
                                                                setViewMessageInput(message.message);
                                                                setViewMessageImg(message.imageUrl);
                                                                setViewReplyImgLikeUrl(message.imageUrlLike);
                                                                setViewReplyVideoUrl(message.videoUrl);

                                                                setViewReplyImgUrl(message.imageUrl);


                                                            }}
                                                        >
                                                            <MdOutlineReply />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    );
                                }

                                return null;
                            })}
                            <div ref={messageListRef} />
                        </div>

                    </div>

                </div>



                {/* message bottom bar --------------------------------------- */}


                <div className="message-bottom-bar">

                    {/* bottom messege Selected for reply --------------------------------- */}

                    {viewMessageInput ?
                        <div className='device-file-select-container'>
                            <div className="device-file-selected-div message-selected-div" >

                                <div style={{ fontWeight: "600" }}> {viewMessageInput}</div>

                            </div>

                            <div className="close-device-file-seleced-div"
                                onClick={() => { setViewMessageInput(null) }}
                            >
                                <MdClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* bottom file Selected from device div --------------------------------- */}

                    {img ?
                        <div className='device-file-select-container'>
                            <div className="device-file-selected-div">
                                {img && img.type.startsWith("video/") ? (

                                    <div className="device-video-selected-div">
                                        <video ref={videoRef} className="device-video-selected" onClick={togglePlayPause}>
                                            <source src={URL.createObjectURL(img)} />
                                        </video>

                                        <div className="device-selected-video-play-button" onClick={togglePlayPause}>

                                            {isPlaying ?


                                                ""
                                                :
                                                <div className="selected-play-btn-div">
                                                    {
                                                        loadingProgress ?
                                                            (<div style={{ color: "white" }}>{loadingProgress}</div>)
                                                            :

                                                            <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} selected-play-btn`}></i>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>


                                ) : img ? (
                                    <img src={URL.createObjectURL(img)} className="device-img-selected" alt="" />
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="close-device-file-seleced-div"
                                onClick={() => { setImg(null) }}
                            >
                                <MdClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                        :
                        null
                    }
                    {/* End --------------------------------- */}



                    {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Select Message For Replay @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}



                    {/* bottom photo Selected for Messages Reply --------------------------------- */}

                    {viewReplyImgUrl ?

                        <div className='device-file-select-container'>
                            <div className="device-file-selected-div">
                                {
                                    viewReplyImgUrl && typeof viewReplyImgUrl === 'string' ? (
                                        <img src={viewReplyImgUrl} className="device-img-selected" alt="" />
                                    ) : (
                                        ""
                                    )
                                }

                            </div>

                            <div className="close-device-file-seleced-div"
                                onClick={() => { setViewReplyImgUrl(null) }}
                            >
                                <MdClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                        :
                        null
                    }


                    {viewReplyVideoUrl ?
                        <div className='device-file-select-container'>
                            <div className="device-file-selected-div">
                                <div className="device-video-selected-div">
                                    <video ref={videoRef} className="device-video-selected" onClick={togglePlayPause}>
                                        <source src={viewReplyVideoUrl} />
                                    </video>

                                    <div className="device-selected-video-play-button" onClick={togglePlayPause}>

                                        {isPlaying ?
                                            ""
                                            :
                                            <div className="selected-play-btn-div">
                                                {
                                                    loadingProgress ?
                                                        (<div style={{ color: "white" }}>{loadingProgress}</div>)
                                                        :

                                                        <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} selected-play-btn`}></i>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>


                            </div>

                            <div className="close-device-file-seleced-div"
                                onClick={() => { setViewReplyVideoUrl(null) }}
                            >
                                <MdClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                        :
                        null
                    }




                    {/* {MessagePhoto ?

                        <div className='device-file-select-container'>
                            <div className="device-file-selected-div">

                                {MessagePhoto ?
                                    <img src={MessagePhoto} className='device-img-selected' alt="" />
                                    :
                                    null
                                }

                            </div>
                            <div className="close-device-file-seleced-div"
                                onClick={() => { setMessagePhoto(null) }}
                            >
                                <MdClose style={{ fontSize: "20px" }} />
                            </div>
                        </div>
                        :
                        null
                    } */}
                    {/* message bottom bar --------------------------------------- */}

                    <div className='message-bottom-inner-div'>
                        <label htmlFor="imgFiles" onClick={() => { setImg(null); setLoadingProgress(false); setIsPlaying(false); }}>
                            <BsFillCameraFill className='message-bottom-camera' />
                        </label>
                        <input id='imgFiles' style={{ display: "none" }} type="file" onChange={(e) => setImg(e.target.files[0])} />


                        <input
                            type="text"
                            onChange={(e) => setMessageInput(e.target.value)}
                            value={messageInput}
                            className="message-bottom-input"
                            placeholder="Message"
                            onKeyDown={handleKeyDown}
                        />

                        <div>
                            {messageInput ?

                                <BiSolidSend
                                    className="message-bottom-send-btn"
                                    color='#0080FF'
                                    onClick={() => {
                                        if (selectedMessageId) {
                                            sendReply(selectedMessageId);

                                        } else {
                                            sendMessage(user.uid, user.name, user.userPhoto);
                                        }
                                    }}
                                />
                                :
                                <BiSend
                                    className="message-bottom-send-btn"
                                    onClick={() => {
                                        if (selectedMessageId) {
                                            sendReply(selectedMessageId);

                                        } else {
                                            sendMessage(user.uid, user.name, user.userPhoto);
                                        }
                                    }}
                                />
                            }
                            {/* <MdSend
                                className="message-bottom-send-btn"
                                onClick={() => {
                                    if (selectedMessageId) {
                                        sendReply(selectedMessageId);

                                    } else {
                                        sendMessage(user.uid, user.name, user.userPhoto);
                                    }
                                }}
                            /> */}
                        </div>

                        <div className='message-bottom-thumb-div'>
                            <FaThumbsUp className='message-bottom-thumb ' onClick={() => SendLike(user.uid, user.name, user.userPhoto)} />
                        </div>
                    </div>
                </div>


            </div>


        </Fragment>
    )
}

export default Messages
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { auth, db, storage } from '../../Firebase';
import { CircularProgress } from '@mui/material';
import "./Messages.scss";
import { MdClose, MdDelete, MdOutlineReply, MdSend } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
import { BsFillCameraFill, BsThreeDots } from 'react-icons/bs';
import { AiOutlineLink } from 'react-icons/ai';
import { AuthContext } from '../../AuthContaxt';
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io"
import { BiSend, BiSolidFilePdf, BiSolidFileTxt, BiSolidSend } from "react-icons/bi"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { motion } from 'framer-motion';

import eone from "./../../Image/img/emoji/beauty.webp"
import etwo from "./../../Image/img/emoji/clap.webp"
import ethree from "./../../Image/img/emoji/cross.webp"
import efour from "./../../Image/img/emoji/heart.webp"
import efive from "./../../Image/img/emoji/holdphon.webp"
import esix from "./../../Image/img/emoji/leftside.webp"
import esevan from "./../../Image/img/emoji/likeLeft.webp"
import eeat from "./../../Image/img/emoji/likeright.webp"
import enine from "./../../Image/img/emoji/pray.webp"
import eten from "./../../Image/img/emoji/shakehand.webp"
import eelevan from "./../../Image/img/emoji/upback.webp"
import etweal from "./../../Image/img/emoji/upfront.webp"
import { Document, Page } from 'react-pdf';

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

    const [isTyping, setIsTyping] = useState(false);


    // useEffect(() => {
    //     let typingTimer;


    //     // Event listener to detect typing
    //     function handleTyping(e) {
    //         setMessageInput(e.target.value); // Update the message input state
    //         setIsTyping(true);


    //         // Clear the timer if it's already running
    //         clearTimeout(typingTimer);

    //         // Set a timer to reset isTyping to false after 3 seconds of inactivity
    //         typingTimer = setTimeout(() => {
    //             setIsTyping(false);

    //         }, 3000); // 3 seconds (adjust as needed)
    //     }

    //     // Attach the event listener to your input field
    //     const inputField = document.getElementById('messageInput'); // Replace with your input field's id

    //     // Check if the inputField exists before adding/removing the event listener
    //     if (inputField) {
    //         inputField.addEventListener('input', handleTyping);
    //     } else {
    //         console.error("Element with ID 'messageInput' not found.");
    //     }

    //     // Clean up the event listener when the component unmounts
    //     return () => {
    //         // Check if the inputField exists before removing the event listener
    //         if (inputField) {
    //             inputField.removeEventListener('input', handleTyping);
    //         }
    //     };
    // }, []);

    useEffect(() => {
        if (user?.uid) {
            const typingRef = doc(db, 'typingStatus', user.uid);

            const unsubscribe = onSnapshot(typingRef, (doc) => {
                const data = doc.data();
                if (data && data.isTyping) {
                    setIsTyping(true);
                } else {
                    setIsTyping(false);
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    const TypingRef = collection(db, 'typingStatus');

    const [typingS, setTypingS] = useState([]);
    useEffect(() => {
        const unsub = () => {
            onSnapshot(TypingRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setTypingS(newbooks);
            })
        };
        return unsub();
    }, []);





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
                }


                else if (img.type === 'text/plain') {
                    // Handle text file upload
                    const storageRef = ref(storage, `messageFiles/${img.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, img);

                    uploadTask.on(
                        'state_changed',
                        // ... (progress and error handling code)
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
                                const fileUrl = await getDownloadURL(storageRef);
                                newMessage.textFileUrl = fileUrl; // You can customize the field name
                                newMessage.txtName = img.name; // You can customize the field name
                                await addDoc(messagesRef, newMessage);
                                console.log("txt file added successfully");
                            } catch (error) {
                                console.error('Error uploading text file:', error);
                            }
                        }
                    );
                }


                else if (img.type === 'application/pdf') {
                    // Handle PDF file upload
                    const storageRef = ref(storage, `messageFiles/${img.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, img);

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
                                const fileUrl = await getDownloadURL(storageRef);
                                newMessage.pdfUrl = fileUrl; // You can customize the field name
                                newMessage.pdfName = img.name; // You can customize the field name
                                await addDoc(messagesRef, newMessage);
                                console.log("PDF file added successfully");
                            } catch (error) {
                                console.error('Error uploading PDF:', error);
                            }
                        }
                    );
                }

                else if (img.type === 'compressed') {
                    // Handle ZIP or RAR file upload
                    const storageRef = ref(storage, `messageFiles/${img.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, img);

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
                                const fileUrl = await getDownloadURL(storageRef);
                                newMessage.archiveUrl = fileUrl; // You can customize the field name
                                newMessage.archiveName = img.name; // Set the field for the file name
                                await addDoc(messagesRef, newMessage);
                                console.log("zip/rar file added successfully");
                            } catch (error) {
                                console.error('Error uploading archive file:', error);
                            }
                        }
                    );
                }




                else if (img.type.startsWith('video/')) {
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
        handleLatestSms(uid, name, recipientImg);
    };

    const handleTyping = () => {
        const typingRef = doc(db, 'typingStatus', currentUser && currentUser.uid);
        setDoc(typingRef, { isTyping: true });

        setTimeout(() => {
            setDoc(typingRef, { isTyping: false });
        }, 5000); // Adjust the timeout duration as needed
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

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    const [one, setOne] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/clapping-hands-4158690-3449620.png?f=webp");
    const [two, setTwo] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/crossed-finger-hand-gesture-4158665-3449644.png?f=webp");
    const [three, setThree] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/good-hand-gesture-4158694-3449624.png?f=webp");
    const [four, setFour] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/handshake-4158680-3449627.png?f=webp");
    const [five, setFive] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/left-direction-finger-hand-gesture-4158679-3449643.png?f=webp");
    const [six, setSix] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/love-hand-gesture-4158688-3449635.png?f=webp");
    const [sevan, setSevan] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/ok-hand-gesture-4158672-3449636.png?f=webp");
    const [eate, setEate] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/pointing-finger-4158681-3449628.png?f=webp");
    const [nine, setNine] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/pointing-finger-4158683-3449630.png?f=webp");
    const [ten, setTen] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/prayer-gesture-4158684-3449631.png?f=webp");

    const [elevan, setElevan] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/heart-7589828-6182721.png?f=webp");
    const [twel, setTwel] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/heartbroken-4849205-4043176.png?f=webp");
    const [thertyn, setThertyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/hearts-4926904-4098519.png?f=webp");

    const [fortyn, setFortyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/crying-face-with-open-eye-and-tears-9435642-7705099.png?f=webp");
    const [fiftyn, setFiftyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/crying-9265573-7547602.png?f=webp");
    const [sixtyn, setSixtyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/love-emoji-5756744-4826128.png?f=webp");
    const [sevantyn, setSevantyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/loving-emoji-6462623-5372192.png?f=webp");
    const [eatyn, setEatyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/cake-5950602-4923213.png?f=webp");
    const [nintyn, setNintyn] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/star-eyes-4783210-3986076.png?f=webp");
    const [twenty, setTwenty] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/tongue-emoji-8832701-7148875.png?f=webp");


    const [messageEmoji, setMessageEmoji] = useState(false);
    const handleMessageEmojiF = () => {
        setMessageEmoji(false);
    }
    const handleMessageEmoji = () => {
        setMessageEmoji(!messageEmoji);
    }

    const handleSendMessageEmoji = async (uid, recipientImg, emojiState) => {
        handleMessageEmoji();
        if (senderId) {
            const messagesRef = collection(db, 'messages');

            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,

                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                imageUrlLike: emojiState,

                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });
        }

    }

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



    const handleLatestSms = async (uid, name, photo) => {
        const latestRef = collection(db, "NewMessage");

        const data = {
            reciverUid: uid,
            reciverName: name,
            reciverPhoto: photo,
            senderUid: currentUser.uid,
            senderName: currentUser.displayName,
            timestamp: serverTimestamp(),
        };
        await addDoc(latestRef, data);

    };




    if (!user) {
        return <>
            <div className='skeleton-center bg-light_0 dark:bg-dark'>
                <CircularProgress className='circularprogress' />
            </div >
        </>;
    }

    return (
        <Fragment>
            <div className="message-main-div bg-light_0 dark:bg-dark">

                {/* Delete Message Permantly ------------------------------------- */}

                {areYouSure &&
                    <div className="are-you-sure-div">
                        <div className="are-you-sure-inner-div bg-lightDiv text-lightPostText dark:text-darkPostText dark:bg-darkDiv">
                            <p>Are you sure?</p>
                            <p>This will Delete messagess permanently for avery one</p>
                            <div className="are-you-sure-btn-div my-4">
                                <button className='btn-D-custom' onClick={() => { deleteMessagesForUser(); deleteFromMessageList(); HandleAreyouSure(); HandleShowMessageOption(); }}>Delete</button>
                                <button className='btn-info-custom'
                                    onClick={() => { HandleAreyouSure(); HandleShowMessageOption(); }}
                                    style={{ background: "#FAFAFA", color: "#0080FF", }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                {areYouSureForCurrentUser &&
                    <div className="are-you-sure-div ">
                        <div className="are-you-sure-inner-div bg-lightDiv text-lightPostText dark:text-darkPostText dark:bg-darkDiv">
                            <p>Are you sure?</p>
                            <p>This will gonna Clear your message Box</p>
                            <div className="are-you-sure-btn-div my-4">
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
                                    <div className="deleteMessagePhoto-div-inner bg-lightDiv text-lightPostText dark:text-darkPostText dark:bg-darkDiv">
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

                <div className="message-top-bar bg-lightDiv  dark:bg-darkDiv">
                    <i onClick={goBack} className="bi bi-arrow-left text-lightPostText dark:text-darkPostText message-back-arrow "></i>

                    <div className="message-profile-div">
                        <Link to={`/users/${user.uid}`} className='message-profile-div'>
                            <img className='message-profile-img' src={user.userPhoto} alt="" />
                            <span className='message-profile-name text-lightProfileName dark:text-darkProfileName'>{user.name}</span>
                            {/* <button className='btn btn-sm btn-danger ms-3' onClick={deleteMessagesForUser}>Clear Chat</button> */}
                        </Link>
                    </div>
                    <div>
                        {showMessageOption ?
                            <div className="top-message-option-btn bg-light_0 text-lightPostText dark:text-darkPostText dark:bg-darkPostIcon"
                                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                                onClick={HandleShowMessageOption}>
                                <BsThreeDots />
                            </div>
                            :
                            <div className="top-message-option-btn bg-light_0 text-lightPostText dark:bg-darkPostIcon dark:bg-darkPostIcon" onClick={HandleShowMessageOption}>
                                <BsThreeDots />
                            </div>

                        }
                        {showMessageOption ?
                            <div className="show-message-option  bg-lightDiv dark:bg-darkInput">
                                <p onClick={HandleAreyouSure} className='mb-3 text-lightProfileName dark:text-darkPostText'>Delete all Chat</p>
                                <p onClick={HandleAreyouSureForCurrentUser} className='text-lightProfileName dark:text-darkPostText'>Delete message from you</p>
                            </div>
                            :
                            null
                        }

                    </div>
                </div>
                {/* Center div ------------------------------------- */}



                <div className="message-center-div bg-lightDiv dark:bg-dark" onClick={handleMessageEmojiF}>

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

                                    const hasTxt = !!message.textFileUrl; // Check if message has an imageUrl
                                    const hasPdf = !!message.pdfUrl; // Check if message has an imageUrl

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
                                                            <i className="bi bi-x-circle-fill text-lightProfileName dark:text-darkProfileName"></i>
                                                        </div>
                                                    </div>
                                                )}

                                                <div
                                                    className={`message-bubble ${isSender ? 'message-sender' : 'message-recipient '} ${hasImage || hasVideo || hasImageLike ? 'has-image' : '' /* Add 'has-image' class when message has an image */
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

                                                                {hasTxt && (
                                                                    <div   onMouseEnter={() => showReplyButton(message.id)}>
                                                                        <a className={`a message-TxtFile-div ${!isSender ? 'text-darkProfileName bg-[#6453ac]  dark:bg-darkReciver dark:text-darkProfileName ' : " bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkSender"}`} href={message.textFileUrl} download={message.txtName}>
                                                                            <BiSolidFileTxt className={`txtFile-icon ${!isSender ? 'dark:text-darkProfileName text-[white]' : 'text-lightProfileName dark:text-darkProfileName'} `} />

                                                                            <div className={`${!isSender ? 'dark:text-darkProfileName text-[white]' : 'dark:text-darkProfileName text-lightProfileName'}`}> {message.txtName} </div>
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {hasPdf && (
                                                                    <div   onMouseEnter={() => showReplyButton(message.id)}>
                                                                        <a className={`a message-TxtFile-div ${!isSender ? 'text-darkProfileName bg-[#6453ac]  dark:bg-darkReciver dark:text-darkProfileName ' : " bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkSender"}`} href={message.pdfUrl} download={message.pdfName}>
                                                                            <BiSolidFilePdf className={`txtFile-icon ${!isSender ? 'dark:text-darkProfileName text-[white] ' : 'text-lightProfileName dark:text-darkProfileName'} `} />
                                                                            <div className={`${!isSender ? 'dark:text-darkProfileName text-[white]' : 'dark:text-darkProfileName text-lightProfileName'}`}> {message.pdfName} </div>
                                                                        </a>
                                                                    </div>
                                                                )}


                                                                {message.message && <div className={`message-content ${!isSender ? 'text-[white] bg-[#6453ac]  dark:bg-darkReciver dark:text-darkProfileName ' : " bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkSender"} `}
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
                                                            <MdOutlineReply className='text-lightProfileName dark:text-darkProfileName' />
                                                        </div>
                                                    </div>
                                                )}
                                            </div >
                                        </>
                                    );
                                }

                                return null;
                            })}

                            {typingS.map((item) => {
                                if (user.uid === item.id) {
                                    return (
                                        <div style={{ color: "black" }}>
                                            {item.isTyping === true ? (
                                                <div className="typing-indicator dark:text-darkProfileName text-lightProfileName ">
                                                    <img className='typing-img' src={user && user.userPhoto} alt="" />

                                                    <div className='typing-bg bg-[#1877f2] dark:bg-darkDiv dark:text-darkProfileName'>
                                                        <div className="dot-1 bg-light_0 dark:bg-darkProfileName"></div>
                                                        <div className="dot-2 bg-light_0 dark:bg-darkProfileName"></div>
                                                        <div className="dot-3 bg-light_0 dark:bg-darkProfileName"></div>
                                                        <div className="dot-4 bg-light_0 dark:bg-darkProfileName"></div>
                                                        <div className="dot-5 bg-light_0 dark:bg-darkProfileName"></div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                }
                            })}



                            <div ref={messageListRef} />
                        </div>

                    </div>

                </div>





                {/* Emoji  */}

                {messageEmoji ?
                    <div className="emoji-container-main">
                        <div className="emoji-div-scroll">
                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/clapping-hands-4158690-3449620.png?f=webp")}>
                                        <img className="message-emoji" src={one} alt="" />
                                    </div>

                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/crossed-finger-hand-gesture-4158665-3449644.png?f=webp"))}>
                                        <img className="message-emoji" src={two} alt="" />
                                    </div>

                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/good-hand-gesture-4158694-3449624.png?f=webp"))}>
                                        <img className="message-emoji" src={three} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/handshake-4158680-3449627.png?f=webp"))}>
                                        <img className="message-emoji" src={four} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/left-direction-finger-hand-gesture-4158679-3449643.png?f=webp"))}>
                                        <img className="message-emoji" src={five} alt="" />
                                    </div>
                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/love-hand-gesture-4158688-3449635.png?f=webp"))}>
                                        <img className="message-emoji" src={six} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/ok-hand-gesture-4158672-3449636.png?f=webp"))}>
                                        <img className="message-emoji" src={sevan} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/pointing-finger-4158681-3449628.png?f=webp"))}>
                                        <img className="message-emoji" src={eate} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/pointing-finger-4158683-3449630.png?f=webp"))}>
                                        <img className="message-emoji" src={nine} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/prayer-gesture-4158684-3449631.png?f=webp"))}>
                                        <img className="message-emoji" src={ten} alt="" />
                                    </div>
                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/heart-7589828-6182721.png?f=webp"))}>
                                        <img className="message-emoji" src={elevan} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/heartbroken-4849205-4043176.png?f=webp"))}>
                                        <img className="message-emoji" src={twel} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/hearts-4926904-4098519.png?f=webp"))}>
                                        <img className="message-emoji" src={thertyn} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/crying-face-with-open-eye-and-tears-9435642-7705099.png?f=webp"))}>
                                        <img className="message-emoji" src={fortyn} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/crying-9265573-7547602.png?f=webp"))}>
                                        <img className="message-emoji" src={fiftyn} alt="" />
                                    </div>
                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/love-emoji-5756744-4826128.png?f=webp"))}>
                                        <img className="message-emoji" src={sixtyn} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/loving-emoji-6462623-5372192.png?f=webp"))}>
                                        <img className="message-emoji" src={sevantyn} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/cake-5950602-4923213.png?f=webp"))}>
                                        <img className="message-emoji" src={eatyn} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/star-eyes-4783210-3986076.png?f=webp"))}>
                                        <img className="message-emoji" src={nintyn} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/tongue-emoji-8832701-7148875.png?f=webp"))}>
                                        <img className="message-emoji" src={twenty} alt="" />
                                    </div>

                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/smiling-emoji-5756745-4826129.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/smiling-emoji-5756745-4826129.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/smiling-face-with-sunglasses-9772269-7914974.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/smiling-face-with-sunglasses-9772269-7914974.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/laughter-4782993-3986090.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/laughter-4782993-3986090.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/laugh-4392368-3718944.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/laugh-4392368-3718944.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/smiling-face-with-heart-6624841-5526095.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/smiling-face-with-heart-6624841-5526095.png?f=webp"} alt="" />
                                    </div>

                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sorry-hand-gesture-8196930-6516359.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sorry-hand-gesture-8196930-6516359.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sorry-face-9435902-7705057.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sorry-face-9435902-7705057.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sorry-hand-gesture-6580716-5526782.png"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sorry-hand-gesture-6580716-5526782.png"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/asking-for-forgiveness-4910565-4090711.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/asking-for-forgiveness-4910565-4090711.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sorry-letter-7623596-6174682.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sorry-letter-7623596-6174682.png?f=webp"} alt="" />
                                    </div>

                                </div>
                            </div>
                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-emoji-6462157-5350281.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-emoji-6462157-5350281.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-emoji-6462181-5350278.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-emoji-6462181-5350278.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-emoji-6462154-5350283.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-emoji-6462154-5350283.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-shock-emoji-6462153-5350284.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-shock-emoji-6462153-5350284.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-loving-emoji-6462242-5350276.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-loving-emoji-6462242-5350276.png?f=webp"} alt="" />
                                    </div>

                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-heartbroken-emoji-6462367-5350272.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-heartbroken-emoji-6462367-5350272.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/sad-envy-emoji-6462155-5350282.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/sad-envy-emoji-6462155-5350282.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/i-love-you-9528528-7703314.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/i-love-you-9528528-7703314.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/free/thumb/free-love-arrow-3216787-2680700.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/free/thumb/free-love-arrow-3216787-2680700.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/hand-holding-love-4825506-4014762.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/hand-holding-love-4825506-4014762.png?f=webp"} alt="" />
                                    </div>

                                </div>
                            </div>

                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/strawberry-fruit-4907445-4086697.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/strawberry-fruit-4907445-4086697.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/dragon-fruit-5367464-4487058.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/dragon-fruit-5367464-4487058.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/orange-fruit-6460988-5331875.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/orange-fruit-6460988-5331875.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/dates-fruit-8056906-6454370.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/dates-fruit-8056906-6454370.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/banana-4991697-4153032.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/banana-4991697-4153032.png?f=webp"} alt="" />
                                    </div>

                                </div>
                            </div>
                            <div className="emoji">
                                <div className="message-emoji-group-one">
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/pineapple-5367455-4487049.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/pineapple-5367455-4487049.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/watermelon-7830907-6226267.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/watermelon-7830907-6226267.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/banana-5843978-4889218.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/banana-5843978-4889218.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/tomato-4383810-3640392.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/tomato-4383810-3640392.png?f=webp"} alt="" />
                                    </div>
                                    <div className="message-emoji-div  dark:bg-darkDiv" onClick={(() => handleSendMessageEmoji(user.uid, user.userPhoto, "https://cdn3d.iconscout.com/3d/premium/thumb/apple-5843980-4889220.png?f=webp"))}>
                                        <img className="message-emoji" src={"https://cdn3d.iconscout.com/3d/premium/thumb/apple-5843980-4889220.png?f=webp"} alt="" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }

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

                    <div className='message-bottom-inner-div bg-lightDiv dark:bg-darkDiv'>


                        <div className='message-emoji-Btn-div text-lightPostText bg-lightDiv dark:bg-darkDiv' onClick={handleMessageEmoji}>
                            {messageEmoji ?
                                <IoIosArrowDown className='text-aqua_0' style={{ fontSize: "18px" }} />
                                :
                                <IoIosArrowUp className='text-aqua_0' style={{ fontSize: "18px" }} />
                            }
                        </div>

                        <label htmlFor="imgFiles" onClick={() => { setImg(null); setLoadingProgress(false); setIsPlaying(false); }}>
                            <AiOutlineLink className='message-bottom-camera text-lightPostIcon dark:text-darkPostIcon' />
                        </label>
                        <input id='imgFiles' style={{ display: "none" }} type="file" onChange={(e) => setImg(e.target.files[0])} />


                        <input
                            type="text"
                            onChange={(e) => setMessageInput(e.target.value)}
                            value={messageInput}
                            className="message-bottom-input text-lightProfileName bg-light_0 dark:bg-darkInput dark:text-darkProfileName"
                            placeholder="Message"
                            accept=".txt, .pdf, .zip, .rar, image/*"
                            onKeyUp={handleTyping}
                            id="messageInput" // Add an ID to your input field
                        />

                        <div>
                            {messageInput ?

                                <BiSolidSend
                                    className="message-bottom-send-btn text-lightPostIcon dark:text-darkPostIcon"
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
                                    className="message-bottom-send-btn text-lightPostIcon dark:text-darkPostIcon"
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
                            <FaThumbsUp className='message-bottom-thumb text-lightPostIcon dark:text-darkPostIcon' onClick={() => SendLike(user.uid, user.name, user.userPhoto)} />
                        </div>
                    </div>
                </div>


            </div>


        </Fragment >
    )
}

export default Messages
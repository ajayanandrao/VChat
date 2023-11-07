import { FieldValue, addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
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
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import "./Emoji.scss";
import { motion } from 'framer-motion';
import Audio from './../../Audio';

import emojiJson from "./emoji.json";
import MessageFriendList from '../MessageFriendList/MessageFriendList';
import Alert from '../../Alert';

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


    const [img, setImg] = useState(null);

    // alert(user.uid)

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


    // useEffect(() => {
    //     const sub = async () => {
    //         console.log(messages.map((item) => item.sound));
    //         const messagesRef = doc(db, 'messages');
    //         await deleteDoc(messageRef,)
    //     };
    //     return sub();
    // }, []);


    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                // Query all documents in the "messages" collection
                const messagesCollection = collection(db, 'messages');
                const querySnapshot = await getDocs(messagesCollection);

                // Iterate through the documents and update each one to set the "sound" field to null
                querySnapshot.forEach(async (doc) => {
                    const docRef = doc.ref;
                    await updateDoc(docRef, {
                        sound: "off"
                    });
                });

                console.log('The "sound" field in all documents of the "messages" collection has been set to null.');
            } catch (error) {
                console.error('Error deleting "sound" field:', error);
            }
        }, 2000); // 5 seconds

        return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    });



    const [historyMessage, setHistoryMessages] = useState([]);

    useEffect(() => {
        const messagesRef = collection(db, 'HistoryMessages');

        if (user && id) {
            const q = query(
                messagesRef, orderBy('timestamp', 'desc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const HistoryMessages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setHistoryMessages(HistoryMessages);
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

    const [hoveredMessageId, setHoveredMessageId] = useState('');
    const showReplyButton = (messageId) => {
        setHoveredMessageId(messageId);
    };
    const [emojiHoveredMessageId, setEmojiHoveredMessageId] = useState('');
    const showEmojiDelteBtn = (messageId) => {
        setEmojiHoveredMessageId(messageId);
    };
    const hideEmojiDelteBtn = (messageId) => {
        setEmojiHoveredMessageId('');
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

    const [sendedMessage, setSendedMessage] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(
                    collection(db, `allFriends/${currentUser.uid}/Message`),
                    orderBy('time', 'asc')
                );

                const unsubscribe = onSnapshot(friendsQuery, (friendsSnapshot) => {
                    const friendsData = friendsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setSendedMessage(friendsData);
                });

                // Return the unsubscribe function to stop listening to updates when the component unmounts
                return () => unsubscribe();
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);


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
                sound: "on",
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

            const messageData1 = {
                userId: currentUser.uid,
                name: currentUser.displayName,
                photoUrl: currentUser.photoURL,
                status: "unseen",
                sound: "on",
                time: serverTimestamp(),

            };

            const messageData2 = {
                userId: uid,
                name: name,
                photoUrl: recipientImg,
                status: "unseen",
                sound: "on",
                time: serverTimestamp(),
            };

            const docRef1 = doc(db, `allFriends/${uid}/Message`, currentUser.uid);
            const docRef2 = doc(db, `allFriends/${currentUser.uid}/Message`, uid);

            const promises = [];

            promises.push(setDoc(docRef1, messageData1, { merge: true }));
            promises.push(setDoc(docRef2, messageData2, { merge: true }));

            await Promise.all(promises);

        } catch (error) {
            console.error("Error sending message:", error);
        }
        handleLatestSms(uid, name, recipientImg);
        setViewMessageInput(null);
    };

    const handleTyping = () => {
        const typingRef = doc(db, 'typingStatus', currentUser && currentUser.uid);
        setDoc(typingRef, { isTyping: true });

        setTimeout(() => {
            setDoc(typingRef, { isTyping: false });
        }, 2000); // Adjust the timeout duration as needed
    };

    // const handleKeyEnter = (event) => {
    //     if (event.key === "Enter") {
    //         sendMessage();
    //     }
    // };

    const handleKeyEnter = (event) => {
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

    const sendReply = async (messageId, uid, name, recipientImg) => {
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
                sound: "on",
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
                reply: replyContent,
            };

            await addDoc(messagesRef, newMessage);

            const messageData1 = {
                userId: currentUser.uid,
                name: currentUser.displayName,
                photoUrl: currentUser.photoURL,
                status: "unseen",
                time: serverTimestamp(),

            };

            const messageData2 = {
                userId: uid,
                name: name,
                photoUrl: recipientImg,
                status: "unseen",
                time: serverTimestamp(),
            };

            const docRef1 = doc(db, `allFriends/${uid}/Message`, currentUser.uid);
            const docRef2 = doc(db, `allFriends/${currentUser.uid}/Message`, uid);

            const promises = [];

            promises.push(setDoc(docRef1, messageData1, { merge: true }));
            promises.push(setDoc(docRef2, messageData2, { merge: true }));

            await Promise.all(promises);

        }

        setSelectedMessageId("");

    };

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    const [messageEmoji, setMessageEmoji] = useState(false);
    const handleMessageEmojiF = () => {
        setMessageEmoji(false);
    }
    const handleMessageEmoji = () => {
        setMessageEmoji(!messageEmoji);
    }



    const handleSendHistorayMessageEmoji = async (uid, recipientImg, emojiState) => {
        handleMessageEmoji();
        if (senderId) {
            const messagesRef = collection(db, 'messages');
            const HistoryMessagesRef = collection(db, 'HistoryMessages');

            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,

                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                imageUrlLike: emojiState,
                sound: "on",
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });
        }

    }
    const handleSendMessageEmoji = async (uid, recipientImg, emojiState) => {
        handleMessageEmoji();
        if (senderId) {
            const messagesRef = collection(db, 'messages');
            const HistoryMessagesRef = collection(db, 'HistoryMessages');

            await addDoc(HistoryMessagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,
                sound: "on",
                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                imageUrlLike: emojiState,
                timestamp: serverTimestamp(),
            })

            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,
                sound: "on",
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
                sound: "on",
                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                imageUrlLike: "https://i.ibb.co/zJfrRMv/Thumbs-Up.png",
                // imageUrlLike: "https://cdn3d.iconscout.com/3d/premium/thumb/like-hand-gesture-6580722-5526788.png?f=webp",
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });

            const messageData1 = {
                userId: currentUser.uid,
                name: currentUser.displayName,
                photoUrl: currentUser.photoURL,
                status: "unseen",
                time: serverTimestamp(),
            };

            const messageData2 = {
                userId: uid,
                name: name,
                photoUrl: recipientImg,
                status: "unseen",

                time: serverTimestamp(),
            };

            const docRef1 = doc(db, `allFriends/${uid}/Message`, currentUser.uid);
            const docRef2 = doc(db, `allFriends/${currentUser.uid}/Message`, uid);

            const promises = [];

            promises.push(setDoc(docRef1, messageData1, { merge: true }));
            promises.push(setDoc(docRef2, messageData2, { merge: true }));

            await Promise.all(promises);
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
                                <button className='btn-dengar-custom' onClick={() => { deleteMessagesForUser(); deleteFromMessageList(); HandleAreyouSure(); HandleShowMessageOption(); }}>Delete</button>
                                <button className='btn-primary-custom'
                                    onClick={() => { HandleAreyouSure(); HandleShowMessageOption(); }}
                                    style={{ background: "none", border: "1px solid #ccc", color: "#0080FF", }}>Cancel</button>
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
                                <button className='btn-dengar-custom' onClick={() => { deleteMessagesForCurrentUser(); HandleAreyouSureForCurrentUser(); HandleShowMessageOption(); }}>Delete</button>
                                <button className='btn-primary-custom'
                                    onClick={() => { HandleAreyouSureForCurrentUser(); HandleShowMessageOption(); }}
                                    style={{ background: "none", border: "1px solid #ccc", color: "#0080FF", }}>Cancel</button>
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
                                        <div className='text-lightProfileName dark:text-darkProfileName'>This will Delete the message for everyone.</div>
                                        <div className='my-4'>
                                            <button className='btn btn-sm btn-danger mx-4' onClick={Delete_Photo_Video}>Delete</button>
                                            <button className='btn btn-sm btn-secondary mx-4' onClick={DeleteMedaiOverlay}>Cancle</button>
                                        </div>
                                    </div>
                                </div>
                            </>}

                            <div className="media-option-div">

                                <div className="media-delete-div">
                                    <div className="media-time text-[black] dark:text-lightDiv"> {PhotoFormatTimestamp(photoTime)}</div>
                                    <MdDelete onClick={() => DeleteMedaiOverlay(MessagePhotoid)} style={{ fontSize: "24px" }} className='photo-delete text-[black] dark:text-lightDiv' />
                                </div>

                                <div className="media-close-div">
                                    <div className="media-close-btn">
                                        <IoMdClose onClick={() => setMessagePhoto(null)} className='media-close-icon text-[black] dark:text-lightDiv' />
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
                                    <div className="media-time text-[black] dark:text-lightDiv"> {MessageVideoFormatTimestamp(messageVideoTime)}</div>
                                    <MdDelete onClick={() => DeleteMedaiOverlay(videoId)} style={{ fontSize: "24px" }} className='photo-delete text-[black] dark:text-lightDiv' />
                                    {/* <MdDelete onClick={() => DeleteVideo(videoId)} style={{ fontSize: "24px" }} className='photo-delete' /> */}
                                </div>

                                <div className="media-close-div">
                                    <div className="media-close-btn">
                                        <IoMdClose onClick={() => { SetVideoUrl(null); setViewVideoDiv(false) }} className='media-close-icon text-[black] dark:text-lightDiv' />
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


                <div className="message-top-bar bg-lightDiv  dark:bg-darkDiv ">
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
                            <div className="show-message-option  bg-light_0 dark:bg-darkInput">
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

                    <div className="message-center-friend-list-div bg-light_0 dark:bg-dark">
                        <MessageFriendList />
                    </div>

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

                                                {/* {isSender && emojiHoveredMessageId === message.id && (
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
                                                )} */}



                                                <div
                                                    className={`message-bubble ${isSender ? 'message-sender' : 'message-recipient '} ${hasImage || hasVideo || hasImageLike ? 'has-image' : '' /* Add 'has-image' class when message has an image */
                                                        }`}>

                                                    {isDeletedBySender ?
                                                        // Reciver Container
                                                        (<>
                                                            {deletedBySenderUid ?

                                                                null

                                                                :

                                                                (<>

                                                                    {!isSender && <div> <img className="message-img" src={user.userPhoto} alt="Sender" /> </div>}

                                                                    <div>
                                                                        {hasImageLike ?
                                                                            ""
                                                                            :
                                                                            <>
                                                                                {/* {isSender && hoveredMessageId === message.id && (
                                                                                        <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}
                                                                                        </div>
                                                                                    )} */}
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
                                                                                    <div className='text-lightPostText dark:bg-darkDiv dark:text-light_0 replay-message-div' style={{ display: "inline-flex" }}>
                                                                                        <div className='dark:text-light_0' >{message.reply}</div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}



                                                                        {/* {!isSender && hoveredMessageId === message.id && (
                                                                                <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}</div>
                                                                            )} */}


                                                                        {hasImage &&
                                                                            <div
                                                                                onClick={() => showReplyButton(message.id)}
                                                                                onMouseLeave={hideReplyButton}>
                                                                                <img onClick={() => ViewMessageImg(message.id, message.imageUrl, message && message.timestamp)} src={message.imageUrl}
                                                                                    className='messageImg' alt="Message" />
                                                                            </div>
                                                                        }

                                                                        {hasVideo &&
                                                                            <div onClick={() => { handleVewVideo(message.id, message.videoUrl, message && message.timestamp); showReplyButton(message.id); }}
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
                                                                            <div className='messageImgLike-div' onClick={() => showReplyButton(message.id)}
                                                                                onMouseLeave={hideReplyButton}>
                                                                                <img src={message.imageUrlLike}
                                                                                    className='messageImgLike' alt="Message" />
                                                                            </div>
                                                                        }



                                                                        {message.message && <div className={`message-content ${!isSender ? 'text-[white] bg-[#6453ac]  dark:bg-darkReciver dark:text-darkProfileName ' : " bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkSender"} `}
                                                                            onClick={() => showReplyButton(message.id)}
                                                                            onMouseLeave={hideReplyButton}
                                                                        >
                                                                            {message.message}

                                                                            <br />
                                                                            {hoveredMessageId === message.id ?
                                                                                <div className='mt-2 d-flex align-items-center'>
                                                                                    {isSender && hoveredMessageId === message.id && (
                                                                                        <div className="dark:text-darkPostTime" style={{ fontSize: "12px" }}>{formatTimestamp(message && message.timestamp)}
                                                                                        </div>
                                                                                    )}

                                                                                    {!isSender && hoveredMessageId === message.id && (
                                                                                        <div className="dark:text-darkPostTime" style={{ fontSize: "12px" }}>{formatTimestamp(message && message.timestamp)}</div>
                                                                                    )}


                                                                                    <div>
                                                                                        {isSender && hoveredMessageId === message.id && (
                                                                                            <div>
                                                                                                <div
                                                                                                    className="delete-butto"
                                                                                                    onClick={() => {
                                                                                                        deleteMessage(message.id);
                                                                                                    }}
                                                                                                >
                                                                                                    <MdDelete style={{ fontSize: "24px", marginLeft: "10px" }} />
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    <>
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
                                                                                                    <MdOutlineReply className='text-lightProfileName dark:text-darkProfileName' style={{ fontSize: "24px", marginLeft: "10px" }} />
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </>

                                                                                </div>
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>}


                                                                    </div>
                                                                </>)

                                                            }

                                                        </>)

                                                        :

                                                        // Sender Container
                                                        (<>

                                                            {!isSender && <div> <img className="message-img" src={user.userPhoto} alt="Sender" />
                                                                {/* {4 + 1 == 6 ? <Audio /> : ""} */}
                                                                {/* <Alert name={"ajay"}/> */}
                                                                {message.sound === "on" ? <Audio/> : ""}
                                                            </div>}

                                                            <div>


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
                                                                            <div className='text-lightPostText dark:bg-darkDiv dark:text-light_0 replay-message-div' style={{ display: "inline-flex" }}>
                                                                                <div className='dark:text-light_0' >{message.reply}</div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}



                                                                {/* {!isSender && hoveredMessageId === message.id && (
                                                                    <div className="last-conversation-time">{formatTimestamp(message && message.timestamp)}</div>
                                                                )} */}


                                                                {hasImage &&
                                                                    <div
                                                                        onClick={() => showReplyButton(message.id)}
                                                                        onMouseLeave={hideReplyButton}

                                                                    >
                                                                        <img onClick={() => ViewMessageImg(message.id, message.imageUrl, message && message.timestamp)} src={message.imageUrl}
                                                                            className='messageImg' alt="Message" />
                                                                    </div>
                                                                }

                                                                {hasVideo &&
                                                                    <div onClick={() => { handleVewVideo(message.id, message.videoUrl, message && message.timestamp); showReplyButton(message.id); }}
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
                                                                    <div className='messageImgLike-div' onClick={() => showEmojiDelteBtn(message.id)}
                                                                        onMouseLeave={hideEmojiDelteBtn}>
                                                                        {isSender && emojiHoveredMessageId === message.id && (
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
                                                                        <img src={message.imageUrlLike}
                                                                            className='messageImgLike' alt="Message" />
                                                                    </div>
                                                                }

                                                                {hasTxt && (
                                                                    <div onMouseEnter={() => showEmojiDelteBtn(message.id)} onMouseLeave={() => showEmojiDelteBtn(message.id)}>
                                                                        <a className={`a message-TxtFile-div ${!isSender ? 'text-darkProfileName bg-[#6453ac] dark:bg-darkReciver dark:text-darkProfileName' : "bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkSender"}`} href={message.textFileUrl} download={message.txtName}>
                                                                            <BiSolidFileTxt className={`txtFile-icon ${!isSender ? 'dark:text-darkProfileName text-[white]' : 'text-lightProfileName dark:text-darkProfileName'}`} />
                                                                            <div className={`${!isSender ? 'dark:text-darkProfileName text-[white]' : 'dark:text-darkProfileName text-lightProfileName'}`}>{message.txtName}</div>
                                                                        </a>
                                                                    </div>
                                                                )}


                                                                {hasPdf && (
                                                                    <div onMouseEnter={() => showEmojiDelteBtn(message.id)} onMouseLeave={() => showEmojiDelteBtn(message.id)}>
                                                                        <a className={`a message-TxtFile-div ${!isSender ? 'text-darkProfileName bg-[#6453ac] dark:bg-darkReciver dark:text-darkProfileName' : "bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkSender"}`} href={message.pdfUrl} download={message.pdfName}>
                                                                            <BiSolidFilePdf className={`txtFile-icon ${!isSender ? 'dark:text-darkProfileName text-[white]' : 'text-lightProfileName dark:text-darkProfileName'}`} />
                                                                            <div className={`${!isSender ? 'dark:text-darkProfileName text-[white]' : 'dark:text-darkProfileName text-lightProfileName'}`}>{message.pdfName}</div>
                                                                        </a>
                                                                    </div>
                                                                )}



                                                                {message.message && <div className={`message-content ${!isSender ? 'text-[white] bg-[#5858FA]  dark:bg-[#5858FA] dark:text-darkProfileName ' : " bg-[#E6E6E6] text-lightProfileName dark:text-darkProfileName dark:bg-darkReciver"} `}
                                                                    onClick={() => showReplyButton(message.id)}
                                                                    onMouseLeave={hideReplyButton}
                                                                >
                                                                    {message.message}

                                                                    <br />
                                                                    {hoveredMessageId === message.id ?
                                                                        <div className='mt-2 d-flex align-items-center'>
                                                                            {isSender && hoveredMessageId === message.id && (
                                                                                <div className="dark:text-darkPostTime" style={{ fontSize: "12px" }}>{formatTimestamp(message && message.timestamp)}
                                                                                </div>
                                                                            )}

                                                                            {!isSender && hoveredMessageId === message.id && (
                                                                                <div className="dark:text-darkPostTime" style={{ fontSize: "12px" }}>{formatTimestamp(message && message.timestamp)}</div>
                                                                            )}


                                                                            <div>
                                                                                {isSender && hoveredMessageId === message.id && (
                                                                                    <div>
                                                                                        <div
                                                                                            className="delete-butto"
                                                                                            onClick={() => {
                                                                                                deleteMessage(message.id);
                                                                                            }}
                                                                                        >
                                                                                            <MdDelete style={{ fontSize: "24px", marginLeft: "10px" }} />
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            <>
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
                                                                                            <MdOutlineReply className='text-lightProfileName dark:text-darkProfileName' style={{ fontSize: "24px", marginLeft: "10px" }} />
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </>

                                                                        </div>
                                                                        :
                                                                        null
                                                                    }
                                                                </div>}
                                                            </div>
                                                        </>)
                                                    }


                                                </div>

                                                {/* {!isSender && hoveredMessageId === message.id && (
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
                                                )} */}
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
                                                        {/* <div className="dot-4 bg-light_0 dark:bg-darkProfileName"></div>
                                                        <div className="dot-5 bg-light_0 dark:bg-darkProfileName"></div> */}
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
                    <motion.div

                        className="emoji-container-main" onClick={handleMessageEmoji}>

                        <div className='all-emoji-wrapper'>
                            <div className='emoji-history-div'>
                                {historyMessage.slice(0, 10).map((hist, index) => {
                                    if (currentUser.uid === hist.sender) {
                                        return (
                                            <div key={index} className='emoji-history-item'>
                                                <div className='emoji-history-icon-div'>
                                                    <img src={hist.imageUrlLike} className='emoji-history-icon' alt="" onClick={() => handleSendHistorayMessageEmoji(user.uid, user.userPhoto, hist.imageUrlLike)} />
                                                </div>
                                            </div>
                                        )
                                    }
                                })}
                            </div>


                            <div className="emoji-div-scroll">
                                {emojiJson.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="message-emoji-div  dark:bg-darkDiv" onClick={() => handleSendMessageEmoji(user.uid, user.userPhoto, item.url)}>
                                                <img src={item.url} alt={`Emoji ${item.id}`} className='message-emoji' />
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    </motion.div>
                    :
                    null
                }

                {/* message bottom bar --------------------------------------- */}



                <div className="message-bottom-bar bg-light_0 dark:bg-darkDiv dark:text-darkPostText">

                    {/* bottom messege Selected for reply --------------------------------- */}


                    {viewMessageInput ?
                        <div className='device-file-select-container'>
                            <div className="device-file-selected-div message-selected-div" >

                                <div style={{ fontWeight: "600" }}> {viewMessageInput}</div>

                            </div>

                            <div className="close-device-file-seleced-div"
                                onClick={() => { setViewMessageInput(null) }}
                            >
                                <MdClose style={{ fontSize: "20px", cursor: "pointer" }} />
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


                                ) : img && img.type.startsWith("image") ? (
                                    <>
                                        <img src={URL.createObjectURL(img)} className="device-img-selected" alt="" />
                                    </>
                                ) : img && img.type.startsWith("application/pdf") ?
                                    (<div className='device-document-selected'>
                                        <BiSolidFilePdf className='device-document-icon' />
                                        <div>
                                            {img.name}
                                        </div>
                                    </div>) : img.type === "text/plain" ? (
                                        <div className='device-document-selected'>
                                            <BiSolidFileTxt className='device-document-icon' />
                                            <div>{img.name}</div>
                                        </div>
                                    ) : null}

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




                    {MessagePhoto ?

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
                    }
                    {/* message bottom bar --------------------------------------- */}



                    <div className='message-bottom-inner-div bg-lightDiv dark:bg-darkDiv'>


                        <div className='message-emoji-Btn-div text-lightPostText bg-lightDiv dark:bg-darkDiv' onClick={handleMessageEmoji}>
                            {messageEmoji ?
                                <IoIosArrowDown className='message-emoji-btn text-aqua_0' style={{ fontSize: "18px" }} />
                                :
                                <IoIosArrowUp className='message-emoji-btn text-aqua_0' style={{ fontSize: "18px" }} />
                            }
                        </div>

                        <label htmlFor="imgFiles" onClick={() => { setImg(null); handleMessageEmojiF(); setLoadingProgress(false); setIsPlaying(false); }}>
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
                            onKeyDown={handleKeyEnter}
                            id="messageInput" // Add an ID to your input field
                            onClick={handleMessageEmojiF}
                        />

                        <div>
                            {messageInput ?

                                <BiSolidSend
                                    className="message-bottom-send-btn text-lightPostIcon dark:text-darkPostIcon"
                                    color='#0080FF'
                                    onClick={() => {
                                        if (selectedMessageId) {
                                            sendReply(selectedMessageId, user.uid,);

                                        } else {
                                            sendMessage(user.uid, user.name, user.userPhoto, user.name, user.userPhoto);
                                        }
                                    }}
                                />
                                :
                                <BiSend
                                    className="message-bottom-send-btn text-lightPostIcon dark:text-darkPostIcon"
                                    onClick={() => {
                                        if (selectedMessageId) {
                                            sendReply(selectedMessageId, user.uid, user.name, user.userPhoto);

                                        } else {
                                            sendMessage(user.uid, user.name, user.userPhoto);
                                        }
                                        handleMessageEmojiF();
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
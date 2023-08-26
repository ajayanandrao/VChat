import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../../AuthContaxt';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../Firebase';
import ReactTimeago from 'react-timeago';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FaPlay, FaShare } from 'react-icons/fa';
import { BsFillChatDotsFill, BsFillHeartFill, BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishStrings from 'react-timeago/lib/language-strings/en';
import Picker from '@emoji-mart/react';

const ProfilePosts = ({ user, post }) => {

    const { currentUser } = useContext(AuthContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

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

    // Like Post 

    const [like, setLike] = useState([]);
    const [liked, setLiked] = useState(false);
    const [isliked, setIsliked] = useState([]);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "AllPosts", post.id, "likes"),
            (snapshot) => setLike(snapshot.docs)
        );
        return () => {
            unsub();
        };
    }, [post.id]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'likes')),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
                // Log the uid property of each document
            }
        );

        return unsubscribe;
    }, [post.id]);

    useEffect(() => {
        setLiked(like.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [like, currentUser.uid]);

    const Heart = async (id) => {
        handleClick();
        const element = document.getElementById(`myheart-${id}`)

        if (liked) {
            await deleteDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid));
            // element.style.color = 'white';
        } else {
            await setDoc(doc(db, "AllPosts", post.id, "likes", currentUser.uid), {
                userId: currentUser.uid,
                name: currentUser.displayName
            });
            // element.style.color = '#FF0040';
        }

    }

    const handleClick = () => {
        setAnimate(!animate);
    };

    function showLike(id) {
        const element = document.getElementById(`showliked-${id}`)
        const comment = document.getElementById(`comment-${id}`);

        if (element.style.display === 'none') {
            element.style.display = 'flex'
            comment.style.display = 'none';
        } else {
            element.style.display = 'none'
        }
    }

    function TimeAgoComponent({ timestamp }) {
        return <ReactTimeago date={timestamp} />;
    }

    // Comment 

    const [commentCount, setCommentCount] = useState(0);
    const [getComment, setComment] = useState([]);
    const [newComment, setNewComment] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(db, 'AllPosts', post.id, 'comments'),
                orderBy('commentTime', 'desc')
            ),
            (snap) => {
                setNewComment(
                    snap.docs.map((snap) => ({
                        id: snap.id,
                        ...snap.data(),
                    }))
                );
                setCommentCount(snap.docs.length);
            }
        );

        return unsubscribe;
    }, [post.id]);

    function comment(id) {
        const element = document.getElementById(`comment-${id}`);
        // const like = document.getElementById(`showliked-${id}`)

        if (element.style.display === 'none') {
            // like.style.display = 'none';
            element.style.display = 'flex'
        } else {
            element.style.display = 'none'
        }
    }

    const deleteComment = (id) => {
        const CommentRf = doc(db, 'AllPosts', post.id, "comments", id)
        deleteDoc(CommentRf);
    };

    const handleKey = (e, id) => {
        if (e.key === "Enter") {
            HandleComment(id);
            done(id);
        }
    };

    const HandleComment = async (e, id) => {
        e.preventDefault();
        if (!getComment) {
            return
        }
        setShowEmoji(false)
        await addDoc(collection(db, 'AllPosts', id, 'comments'), {
            comment: getComment,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
            commentTime: serverTimestamp(),
        });

        setComment('');
    };

    const [showAll, setShowAll] = useState(false);

    const formatter = buildFormatter(englishStrings);
    const userComment = newComment.slice(0, showAll ? newComment.length : 3).map((item) => {

        return (
            <div key={item.id}>
                <span className="UserComment-wrapper">
                    <div className="UserComment-div">
                        <div className="UserComment-Profile-div">
                            <img src={item.photoURL} className='UserComment-Profile-img' alt="" />
                            <div className="UserComment-Profile-name">
                                {item.displayName}
                            </div>
                        </div>
                        <div className="UserCommet-Text-div">
                            {item.comment}
                        </div>
                    </div>
                </span>
            </div>
        )
    });

    const [editInput, setEditInput] = useState('');
    const [EditImg, setEditImg] = useState(null);
    const [updating, setUpdating] = useState(false);

    const done = async (id) => {
        setUpdating(true);
        const postRef = doc(db, 'AllPosts', id);
        if (!editInput) {
            return
        }
        if (EditImg) {
            // If a new image is provided, upload it to storage and update the document
            const storageRef = ref(storage, `Post/${EditImg.name}`);
            await uploadBytes(storageRef, EditImg);

            const imageUrl = await getDownloadURL(storageRef);

            await updateDoc(postRef, {
                postText: editInput,
                img: imageUrl
            });
        } else {
            // If no new image is provided, only update the name field
            await updateDoc(postRef, {
                postText: editInput
            });
        }
        setEditInput("");
        setUpdating(false);
        document.getElementById(`overlay-${id}`).style.display = 'none';
    }

    // Emoji 

    const [showEmoji, setShowEmoji] = useState(false);
    const Emoji = () => {
        setShowEmoji(!showEmoji);
    };

    const addEmoji = (e) => {
        let sym = e.unified.split("-")
        let codesArray = []
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setComment(getComment + emoji);
    };

    // Option

    function OptionBtn(id) {
        const x = document.getElementById(`myDropdown-${id}`);
        const profile = document.getElementById(`profileView-${id}`);
        const del = document.getElementById(`del-${id}`);

        if (x.style.display == 'none') {
            x.style.display = 'block';
            profile.style.display = 'none';
        } else {
            x.style.display = 'none';
        }
        if (currentUser.displayName !== post.displayName) {
            document.getElementById(`edit-${id}`).style.display = 'none';
            profile.style.display = 'block';
            del.style.display = 'none';
        }
    }

    function postEdit(id) {
        // const x = document.getElementById(`edit-${id}`);
        document.getElementById(`overlay-${id}`).style.display = 'block'
        const dropdown = document.getElementById(`myDropdown-${id}`);

        if (dropdown) {
            dropdown.classList.remove('show');
        }

    };

    const deletePost = async id => {
        const colRef = doc(db, 'AllPosts', id)
        deleteDoc(colRef)
    }

    function off(id) {
        document.getElementById(`overlay-${id}`).style.display = 'none';
        setEditImg(null);
    }


    return (
        <div>
            <div className="feed-container">
                <div className="feed-div">

                    <div className="feed-profile-div">
                        <img src={post.photoURL} className='feed-img' alt="" />

                        <div className="feed-profile-name">
                            {post.displayName}
                        </div>

                        <div className="feed-time">
                            <TimeAgoComponent timestamp={post.bytime && post.bytime.toDate()} />
                        </div>

                        <div className='feed-option-div'>
                            <div className="feed-option-btn">
                                <BsThreeDotsVertical className='feed-icon' onClick={() => OptionBtn(post.id)} />
                            </div>
                            <div className="feed-option-mainu-div" id={`myDropdown-${post.id}`} style={{ display: "none" }}>

                                <div className='feed-option-edit' id={`edit-${post.id}`} onClick={() => postEdit(post.id)}>Edit</div>

                                <div className='feed-option-delete'
                                    id={`del-${post.id}`}
                                    onClick={() => deletePost(post.id)} >Delete</div>

                                <div className='feed-option-delete' id={`profileView-${post.id}`}>View Profiel</div>
                            </div>
                        </div>
                    </div>



                    {/* Feed Text */}
                    <div className="feed-post-text userPost-text">
                        {post.postText}
                    </div>

                    {/* Feed Photo */}
                    <div className="feed-post-container">

                        {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                            <img width={"300px"} src={post.img} alt="Uploaded" className="Feed-Post-img" />
                        ) : post.img ? (

                            <div className="video-container">
                                <video ref={videoRef} className="video" onClick={handleVideoBtnClick}>
                                    <source src={post.img} type="video/mp4" />
                                </video>
                                {!isPlaying && (
                                    <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                        <div className="play-button" >
                                            <FaPlay className='play-button' />
                                        </div>
                                    </a>
                                )}
                            </div>


                        ) : null}



                    </div>

                    {/* Feed Comment */}

                    <div className="feed-bottom-container">

                        {/* Like */}
                        <div className="feed-bottom-mainu">
                            {/* <BsFillHeartFill onClick={() => Heart(post.id)} className='feed-bottom-icon' /> */}

                            {liked ? (<BsFillHeartFill
                                onClick={() => Heart(post.id)} className='feed-bottom-icon' color='#FF0040' />
                            ) : (<BsFillHeartFill
                                onClick={() => Heart(post.id)} className='feed-bottom-icon' />)}


                            <div className='feed-like' onClick={() => showLike(post.id)}>
                                {like.length > 0 && like.length}
                            </div>

                            <div className='See-Like-div'
                                style={{ display: 'none' }} id={`showliked-${post.id}`}>

                                <div className='userliked' id={`isliked${post.id}`} >
                                    {isliked.map((item) => {
                                        return (
                                            <item.id>
                                                <div key={item.id}>
                                                    <div className='mx-1' style={{ fontSize: "11px", color: "black" }}>{item.name}</div>
                                                </div>
                                            </item.id>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="feed-bottom-mainu">
                            <BsFillChatDotsFill onClick={() => comment(post.id)} className='feed-bottom-icon' />

                            <span className='comment-counter ms-2' >{commentCount > 0 && commentCount}</span>
                        </div>

                        {/* Share */}
                        <div className="feed-bottom-mainu">
                            <FaShare className='feed-bottom-icon' />
                        </div>

                    </div>

                    <div
                        className='Feed-Comment-Div' id={`comment-${post.id}`}
                        style={{ display: 'none' }}>

                        <div className='feed-comment-div-one'>
                            <input
                                type='text'
                                placeholder='add a comment'
                                className='Feed-Comment-Input'
                                value={getComment} onChange={(e) => setComment(e.target.value)}
                                onKeyDown={handleKey}
                            />

                            <div
                                onClick={Emoji}
                                style={{
                                    margin: '0 1.5rem',
                                    fontSize: '18px',
                                    cursor: 'pointer'
                                }}
                            >
                                😃
                            </div>
                            <IoMdSend type='submit' className='send-icon'
                                onClick={(e) => HandleComment(e, post.id)}
                            />
                        </div>

                        {showEmoji && (<div>
                            <div className='emoji mb-3'>
                                <Picker emojiSize={18} emojiButtonSize={30} onEmojiSelect={addEmoji} />
                            </div>
                        </div>)}
                        <hr className='hrr' />


                    </div>
                    {/* <span className='name'>ajay</span> */}
                    {/* <div className='mb-3'>{userComment}</div> */}

                </div>
            </div >
        </div>
    )
}

export default ProfilePosts

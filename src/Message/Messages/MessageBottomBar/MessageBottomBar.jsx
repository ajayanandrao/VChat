import React, { Fragment, useState } from 'react'
import "./MessageBottomBar.scss";
import { FaThumbsUp } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { BsFillCameraFill } from 'react-icons/bs';
import { db } from '../../../Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


const MessageBottomBar = ({ setImg, setLoadingProgress, setIsPlaying, handleKeyDown, messageInput,
    setMessageInput, sendMessage, selectedMessageId, user, sendReply, senderId, currentUser }) => {


    const SendLike = async (uid, recipientImg) => {
        if (senderId) {
            const messagesRef = collection(db, 'messages');
            // Create a new document using `addDoc` function
            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,

                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                // imageUrlLike: "https://cdn3d.iconscout.com/3d/premium/thumb/like-gesture-4158696-3449626.png?f=webp",
                imageUrlLike: "https://bnz05pap002files.storage.live.com/y4mSWL2WMwZ746bk2CSe91bgV-AjIiADOEwJQfrxSOjnzLMti-s6UGcRQ7ruzqx2uyVueRBkdfJqNXF7U0LWrCuW7oJbohPL84QJes4WciqfuHP0Mboaaqcd0aukcoBnpK5b2XvsopA7b0DVE9-0VCezYmq26KTZQYDl8bI243p38eMUbeUJN01HbGUujSBwrbSqSbBdQ-mNgLyX6TuUEKsOuuJOBAQYq_IaidDybjBjKI?encodeFailures=1&width=255&height=450",
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });
        }
    }


    return (
        <Fragment>

            <div className='message-input-wrapper-inner'>

                <label htmlFor="imgFiles" onClick={() => { setImg(null); setLoadingProgress(false); setIsPlaying(false); }}>
                    <BsFillCameraFill className='message-camera ms-icon' />
                </label>

                <input id='imgFiles' style={{ display: "none" }} type="file" onChange={(e) => setImg(e.target.files[0])} />

                <input
                    type="text"
                    onChange={(e) => setMessageInput(e.target.value)}
                    value={messageInput}
                    className="message-input"
                    placeholder="Type..."
                    onKeyDown={handleKeyDown}
                />

                <MdSend
                    className="message-send-btn ms-icon"
                    onClick={() => {
                        if (selectedMessageId) {
                            sendReply(selectedMessageId);

                        } else {
                            sendMessage(user.uid, user.name, user.userPhoto);
                        }
                    }}
                />

                <FaThumbsUp className='message-thumb ms-icon' onClick={() => SendLike(user.uid, user.name, user.userPhoto)} />
            </div>

        </Fragment>
    )
}

export default MessageBottomBar
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';

const PostComponent = ({ post }) => {

    const { currentUser } = useContext(AuthContext);
    const [latestLikedPostId, setLatestLikedPostId] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'Notification'),
                orderBy('time', 'desc')
            ),
            (snapshot) => {
                if (!snapshot.empty) {
                    const likedDocs = snapshot.docs;

                    if (likedDocs.length > 1) {
                        // If there are more than one liked documents, check if they have the same latest timestamp
                        const latestTime = likedDocs[0].data().time;
                        const hasSameTime = likedDocs.every(doc => doc.data().time === latestTime);

                        if (hasSameTime) {
                            setLatestLikedPostId(likedDocs[0].id); // Set the ID of the first liked document
                        } else {
                            setLatestLikedPostId(null); // Don't show anything if timestamps are not the same
                        }
                    } else {
                        setLatestLikedPostId(likedDocs[0].id); // Set the ID of the only liked document
                    }
                } else {
                    setLatestLikedPostId(null);
                }
            }
        );

        return unsubscribe;
    }, [post.id]);


    return (
        <div>

            {latestLikedPostId && (
                <div>
                    {latestLikedPostId}
                </div>
            )}

        </div>
    )
}

export default PostComponent
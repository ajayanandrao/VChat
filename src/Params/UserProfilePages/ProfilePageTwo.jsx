
import React, { useContext } from 'react';
import "./ProfilePageTwo.scss";
import { FaUserEdit } from "react-icons/fa"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePageTwo = ({ user, userId }) => {

    const { currentUser } = useContext(AuthContext);

    const nav = useNavigate();

    const option = () => {
        const x = document.getElementById("option");
        if (x.style.display == "none") {
            x.style.display = "flex";
        }
        else {
            x.style.display = "none";
        }
    }


    const deleteFriend = async () => {
        const CurrentFriendRef = collection(db, `allFriends/${currentUser.uid}/Friends`);
        // console.log(user);
        console.log(userId);
        console.log(user.uid);
        try {
            const CurrentUserDoc = await getDoc(doc(CurrentFriendRef, userId));

            if (CurrentUserDoc.exists()) {
                await deleteDoc(doc(CurrentFriendRef, userId));
                console.log('Friend deleted successfully');
                nav(-1)
            } else {
                console.log('Friend not found');
            }

        } catch (error) {
            console.error('Error deleting friend:', error);
        }

        const RequestRef = doc(db, 'NewFriendRequests', currentUser.uid + user.uid);

        try {
            await deleteDoc(RequestRef);
            console.log('Friend Request deleted successfully');
        } catch (error) {
            console.error('Error deleting friend request:', error);
        }

        // ==========================================================

        const friendsRef = collection(db, `allFriends/${user && user.uid}/Friends`);
        const friendsQuery = query(friendsRef, where('userId', '==', currentUser.uid));

        try {
            const querySnapshot = await getDocs(friendsQuery);

            querySnapshot.forEach(async (doc) => {
                console.log('Found user ID:', doc.data().userId);

                try {
                    await deleteDoc(doc.ref); // Use doc.ref to get the document reference
                    console.log('Friend deleted successfully');
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


    return (
        <>

            <div className="profile-name-container-main" >
                <h3 className='profile-name-text'>{user.name}</h3>
                <div className='profile-Page-add-btn'>

                    <Link to={`/users/${user.uid}/message`}>
                        <button className='btn btn-primary btn-sm'>Message</button>
                    </Link>

                    <div className='profile-option-div' onClick={option}>
                        <FaUserEdit style={{ fontSize: "24px" }} />
                        <div className="profile-option-absolute" id='option' style={{ display: "none" }} onClick={deleteFriend}>
                            Unfriend
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePageTwo
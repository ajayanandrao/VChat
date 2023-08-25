import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { AuthContext } from './../AuthContaxt';
import { db } from './../Firebase';

const Users = () => {

    const [users, setUsers] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'UpdateProfile'));
                const userList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userList);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <h1>All Users</h1>

            {users.map((user) => (
                <div key={user.id}>

                    <Link to={`/users/${user.id}`}>
                        <h1>{user.name}</h1>
                        <img src={user.userPhoto} width={"100px"} alt="" />
                    </Link>
                </div>
            ))}

        </>
    )
}

export default Users

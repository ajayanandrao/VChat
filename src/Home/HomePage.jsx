import { signOut } from 'firebase/auth';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';

const HomePage = () => {

    const nav = useNavigate();

    const LogOut = async () => {

        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });

        nav("/");
    };

    return (
        <div>
            HomePage

            <button className='btn btn-info mx-4' onClick={LogOut}>signOut</button>
        </div>

    )
}

export default HomePage
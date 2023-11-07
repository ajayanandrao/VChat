import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from './Firebase';
import { AuthContext } from './AuthContaxt';

const Alert = ({ name }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div>
            {name && name}
        </div>
    )
}

export default Alert
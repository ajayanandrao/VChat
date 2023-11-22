import React from 'react'
import "./Electronics.scss"
import { Link } from 'react-router-dom'

const Electronics = () => {
    return (
        <div className='d-flex'>
            <div className="left"></div>

            <div className="emain-container bg-light_0 dark:bg-dark">
                <div className="ecard bg-lightDiv dark:bg-darkDiv">
                    <div className="ecard-text">
                        Mobiles
                    </div>
                </div>

                <Link to={"/laptop/"} className=" link ecard bg-lightDiv dark:bg-darkDiv">
                    <div className="ecard-text">
                        Laptop
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Electronics
import React from 'react'
import "./Laptop.scss";
import { Link } from 'react-router-dom';

const Laptop = () => {
    return (
        <div className='d-flex'>
            <div className="left"></div>
            <div className="lmain-container bg-light_0 dark:bg-dark">

                <p className='lmain-title text-lightProfileName dark:text-darkProfileName'>Laptop</p>

                <div className="laptop-grid-div">

                    <Link to={"/laptopDetail/"} className="lgrid-card  bg-light_0 dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                        <div className="lgrid-card-photo bg-lightDiv dark:bg-darkPostIcon"></div>
                        <p className="lgrid-card-company">Dell</p>
                        <p className="lgrid-card-price">20500</p>
                        <p className="lgrid-card-address">near nanalpeth </p>
                    </Link>
                    <div className="lgrid-card  bg-light_0 dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                        <div className="lgrid-card-photo bg-lightDiv dark:bg-darkPostIcon"></div>
                        <p className="lgrid-card-company">Dell</p>
                        <p className="lgrid-card-price">20500</p>
                        <p className="lgrid-card-address">near nanalpeth </p>
                    </div>
                    <div className="lgrid-card  bg-light_0 dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                        <div className="lgrid-card-photo bg-lightDiv dark:bg-darkPostIcon"></div>
                        <p className="lgrid-card-company">Dell</p>
                        <p className="lgrid-card-price">20500</p>
                        <p className="lgrid-card-address">near nanalpeth </p>
                    </div>
                    <div className="lgrid-card  bg-light_0 dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                        <div className="lgrid-card-photo bg-lightDiv dark:bg-darkPostIcon"></div>
                        <p className="lgrid-card-company">Dell</p>
                        <p className="lgrid-card-price">20500</p>
                        <p className="lgrid-card-address">near nanalpeth </p>
                    </div>
                    <div className="lgrid-card  bg-light_0 dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">
                        <div className="lgrid-card-photo bg-lightDiv dark:bg-darkPostIcon"></div>
                        <p className="lgrid-card-company">Dell</p>
                        <p className="lgrid-card-price">20500</p>
                        <p className="lgrid-card-address">near nanalpeth </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Laptop
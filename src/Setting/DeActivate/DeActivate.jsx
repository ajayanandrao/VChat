import React from 'react'
import "./DeActivate.scss";

const DeActivate = () => {
    return (
        <div className='deact-main-container bg-light_0 dark:bg-dark'>
            <div className="left"></div>
            <div className="deact-main-inner-div text-lightProfileName dark:text-darkProfileName">
                <div className="deact-center">
                    <p className='deact-note'>Note: if you deactivate your VChat account then no buddy can see your profile or account, your data will not be deleted permanantly</p>
                    <div className="btn btn-danger">DeActivate</div>
                </div>
            </div>
        </div>
    )
}

export default DeActivate
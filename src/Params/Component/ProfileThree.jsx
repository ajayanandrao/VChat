import React from 'react'
import "./ProfileThree.scss";
import UserPhoto from '../ParamsTab/UserPhoto';

const ProfileThree = ({ user }) => {

    function openCity(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }


    return (
        <>
            <div className="profileThree-container">


                <div className="tab">
                    <button className="tablinks active" onClick={(event) => openCity(event, 'Post')}>Post</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'About')}>About</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Friend')}>Friend</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Photo')}>Photos</button>
                </div>

                <div className='content-div'>

                    <div id="Post" className="tabcontent w3-animate-opacity" style={{ display: "block" }}>
                        {/* <UserPostProps /> */}
                        Profile Locked
                    </div>

                    <div id="About" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        {/* <About /> */}
                        Profile Locked
                    </div>

                    <div id="Friend" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        {/* <Friends /> */}
                        Profile Locked
                    </div>

                    <div id="Photo" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        <UserPhoto user={user} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileThree

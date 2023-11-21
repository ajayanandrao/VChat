import React from 'react'
import "./AddHospital.scss";
import logo from "./../Image/img/logo192.png"
import LeftArro from '../LeftArro';
import { useState } from 'react';
import { db, storage } from "./../Firebase";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { BsFillCameraFill } from "react-icons/bs"
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';

const AddHospitals = () => {

    const [image, setImage] = useState(null);
    const [hname, setHname] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [quali, setQuali] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [taluka, setTaluka] = useState("");
    const [distic, setDistic] = useState("");
    const [state, setState] = useState("");
    const [pin, setPin] = useState("");
    const [am, setAm] = useState("");
    const [pm, setPm] = useState("");

    const [overlay, setOverlay] = useState(false);

    const compressImage = async (image, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(image);
        });
    };

    const handleSubmit = async () => {

        if (image && hname && contact && address && taluka && distic && state) {
            if (image.type.startsWith('image/')) {
                try {
                    const colRef = collection(db, "Hospital");
                    const compressedImgBlob = await compressImage(image, 800);
                    const storageRef = ref(storage, "Hospital/" + hname);
                    const uploadTask = uploadBytesResumable(storageRef, compressedImgBlob);
                    uploadTask.on('state_changed',
                        (snapshot) => {

                        },
                        (error) => {
                            // Handle unsuccessful uploads
                        },
                        () => {

                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                                await addDoc(colRef, {
                                    image: downloadURL,
                                    hospitalName: hname,
                                    doctorName: doctorName,
                                    qualification: quali,
                                    time: `${am}am To ${pm}pm`,
                                    contact: contact,
                                    address: address,
                                    taluka: taluka,
                                    distic: distic,
                                    state: state,
                                    pin: pin,
                                    timestamp: serverTimestamp()
                                });
                                setOverlay(true);
                            });
                        }
                    );

                    // Success: You may want to show a success message or redirect the user
                } catch (error) {
                    console.error("Error adding hospital: ", error);
                    // Handle the error: Show an error message to the user
                }
            }
        }
        else {
            alert("Please fill all fields")
        }

    };

    const Overlay = () => {
        setImage(null);
        setImage("");
        setHname("");
        setDoctorName("");
        setQuali("");
        setContact("");
        setAddress("");
        setTaluka("");
        setDistic("");
        setState("");
        setPin("");
        setAm("");
        setPm("");
        setOverlay(!overlay);
    }



    return (
        <div className='addHospital-main-container bg-light_0 dark:bg-dark'>
            <LeftArro />
            <div className="left"></div>
            <div className="addHospital-container">
                {overlay ?
                    <div className="overlay-div">
                        <div className="overlay-card">
                            <div className="overlay-text">Successfully Saved</div>
                            <button className='btn btn-outline-light ' onClick={Overlay} >Close</button>
                        </div>
                    </div>
                    :
                    null
                }
                <div className="addHospital-image-div">
                    <div className="addHospital-image-div-inner">
                        <div className="addHospital-image-color">
                            <div className="addHospital-logo-div">
                                <img src={logo} alt="" className='addHospital-logo' />VChat
                            </div>
                            <p className='addHospital-text'> we use this information for people to search hospitals fast and easy  </p>
                        </div>
                    </div>
                </div>

                <div className='addHospital-Title text-lightProfileName dark:text-darkProfileName'>Add A Hopital</div>

                <div className="image-div">
                    {image ?

                        (<>
                            <label htmlFor="image" className='image'>
                                <img className='image' src={image ? URL.createObjectURL(image) : null} alt="" />
                            </label>
                        </>)
                        :
                        <label htmlFor="image">
                            <div className="image-null bg-lightDiv dark:bg-darkPostIcon">
                                <BsFillCameraFill className='image-icon ' />
                            </div>
                        </label>
                    }
                    <input type="file" id='image' style={{ display: "none" }} onChange={(e) => setImage(e.target.files[0])} />
                </div>


                <div className="addHospital-div  ">

                    <div className="addHoptial-wrapper bg-lightDiv  dark:bg-darkDiv text-lightProfileName dark:text-darkProfileName">


                        <div className="addHospital-item-div">
                            <div className="addHostpital-item-category">Hospital Name</div>
                            <input type="text" placeholder='Hospital Name' className='addHospital-input bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={hname} onChange={(e) => setHname(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Doctor Name</div>
                            <input type="text" placeholder='Doctor Name' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Qualification</div>
                            <input type="text" placeholder='Doctor Qualification' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={quali} onChange={(e) => setQuali(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Contact</div>
                            <input type="text" placeholder='Contact' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={contact} onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">

                            <div className="addHostpital-item-category">Time</div>

                            <input type="text" placeholder='Am' className='addHospital-input time-am bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={am} onChange={(e) => setAm(e.target.value)} />

                            <div style={{ margin: "0 10px" }}>To</div>

                            <input type="text" placeholder='Pm' className='addHospital-input 
                            time-pm bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={pm} onChange={(e) => setPm(e.target.value)} />
                        </div>

                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Address</div>
                            <input type="text" placeholder='Address' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Taluka</div>
                            <input type="text" placeholder='Taluka' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={taluka} onChange={(e) => setTaluka(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">District</div>
                            <input type="text" placeholder='District' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={distic} onChange={(e) => setDistic(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">State</div>
                            <input type="text" placeholder='State' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={state} onChange={(e) => setState(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category">Pin Code</div>
                            <input type="text" placeholder='Pin Code' className='addHospital-input bg-bg-lightDiv text-lightProfileName dark:bg-darkInput dark:text-darkProfileName' value={pin} onChange={(e) => setPin(e.target.value)} />
                        </div>
                        <div className="addHospital-item-div text-lightProfileName dark:text-darkProfileName">
                            <div className="addHostpital-item-category"></div>
                            <button className='btn btn-primary ' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
                <div className="margin"></div>

            </div>
        </div>
    )
}

export default AddHospitals
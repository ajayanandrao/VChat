import React, { useContext, useEffect, useState } from 'react'
import "./Wedding.scss";
import aj from "./../Image/img/200.png"
import file from "./../Image/img/photo.png";
import { db, storage } from './../Firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import LeftArro from '../LeftArro';



const Wedding = () => {
    const { currentUser } = useContext(AuthContext);
    const [isDay, setIsDay] = useState(false);
    const [itemDay, setItemDay] = useState("");

    const toggleDropdownDay = () => {
        setIsDay(!isDay);
        setIsMonth(false);
        setIsYear(false);
        setIsOpenReligin(false);
        setIsOpen(false);
    };
    const handleItemDayClick = (item) => {
        console.log(`Selected item: ${item}`);
        setIsDay(false);
        setItemDay(item);
    };
    const days = Array.from({ length: 31 }, (_, index) => index + 1);


    const [isMonth, setIsMonth] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");

    const toggleDropdownMonth = () => {
        setIsMonth(!isMonth);
        setIsDay(false);
        setIsYear(false);
        setIsOpenReligin(false);
        setIsOpen(false);

    };

    const handleItemMonthClick = (selectedItem) => {
        console.log(`Selected month: ${selectedItem}`);
        setIsMonth(false);
        setSelectedMonth(selectedItem);
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [isYear, setIsYear] = useState(false);
    const [selectedYear, setSelectedYear] = useState("");

    const toggleDropdownYear = () => {
        setIsYear(!isYear);
        setIsDay(false);
        setIsMonth(false);
        setIsOpenReligin(false);
        setIsOpen(false);
    };

    const handleItemYearClick = (selectedItem) => {
        console.log(`Selected year: ${selectedItem}`);
        setIsYear(false);
        setSelectedYear(selectedItem);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1950 + -18 }, (_, index) => 1950 + index);

    const [isOpen, setIsOpen] = useState(false);
    const [item, setItem] = useState("");


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIsOpenReligin(false);
        setIsMonth(false);
        setIsYear(false);
        setIsDay(false);
    };
    const handleItemClick = (item) => {
        // console.log(`Selected item: ${item}`);
        setIsOpen(false);
        setItem(item);
        // setWoman(item);
    };


    const [isOpenReligin, setIsOpenReligin] = useState(false);
    const [itemReligin, setItemReligin] = useState("");

    const toggleDropdownReligin = () => {
        setIsOpenReligin(!isOpenReligin);
        setIsOpen(false);
        setIsMonth(false);
        setIsYear(false);
        setIsDay(false);
    };

    const handleItemReligionClick = (item) => {
        console.log(`Selected item: ${item}`);
        setIsOpenReligin(false);
        setItemReligin(item);
    };



    const [photo, setPhoto] = useState(null);
    const [photoOne, setPhotoOne] = useState(null);
    const [photoTwo, setPhotoTwo] = useState(null);



    const [looking, setLooking] = useState("");
    const [region, setRegion] = useState("");

    const [first, setFirst] = useState("");
    const [middel, setMiddel] = useState("");
    const [last, setLast] = useState("");
    const [mobile, setMobile] = useState("");
    const [Work, setWork] = useState("");
    const [height, setHeight] = useState("");

    const [qualification, setQualification] = useState("");
    const [salary, setSalary] = useState("");

    const [landmark, setLandmark] = useState("");
    const [village, setVillage] = useState("");
    const [distric, setDistric] = useState("");
    const [state, setState] = useState("");


    const Save = () => {
        if (photo) {
            let downloadURL = "";

            if (photo) {

                const storageRef = ref(storage, "WeddingPhoto/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, photo);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            saveData(downloadURL);

                            console.log('img uploaded successfully');
                        } catch (error) {
                            console.log('Error uploading img:', error);
                        }
                    }
                );
            } else {
                saveData(downloadURL); // Pass an empty string as the downloadURL
            }
        } else {
            console.log('No img or text entered');
        }

    }

    const saveData = async (downloadURL) => {
        const colRef = collection(db, 'WeddingDatabase');

        await addDoc(colRef, {
            // name: img ? img.name : '',
            photoOne: photo ? downloadURL : '',
            uid: currentUser.uid,
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
            first: first,
            middel: middel,
            last: last,
            mobile: mobile,
            work: Work,

            landmark: landmark,
            village: village,
            distric: distric,
            state: state,

            qualification: qualification,
            salary: salary,

            looking: item,
            height: height,
            region: itemReligin,

            date: itemDay,
            month: selectedMonth,
            years: selectedYear,
            time: serverTimestamp(),
        });

        setPhoto(null);
        setFirst("")
        setMiddel("")
        setLast("")
        setMobile("")
        setWork("")
        setHeight("")
        setVillage("")
        setDistric("")
        setState("")
        setLooking("")
        setItemDay("")
        setSelectedMonth("")
        setSelectedYear("")
        setLandmark("")

    };



    return (
        <>
            <div className='add-wedding-container dark:bg-darkDiv'>

                <div style={{
                    backgroundSize: "cover", width: "100%",
                    height: "200px", display: "flex", justifyContent: "center",
                    alignItems: "center",
                    backgroundImage: `url("https://img.freepik.com/free-photo/groom-putting-ring-bride-s-finger_1157-338.jpg")`
                }}>

                    <LeftArro />


                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0, 0, 0, 0.30)", width: "100%", height: "100%" }}>
                        <h2 style={{ color: "white", textAlign: "center", marginTop: "30px" }} className='text-3xl'>
                            Matrimony Profile <div id='l'></div> </h2>
                    </div>
                </div>

                <div style={{ padding: "0 1rem", width: "100%" }}>
                    <div className="religion-wedding-div">
                        <div className="toggle-dropdown me-3">
                            <button className="toggle-button" onClick={toggleDropdown}>
                                {isOpen ? (
                                    <>
                                        {item ? item : "Looking For a"}  <i className="bi bi-chevron-up chevron"></i>
                                    </>
                                ) : (
                                    <>
                                        {item ? item : "Looking For a"} <i className="bi bi-chevron-down chevron"></i>
                                    </>
                                )}
                            </button>
                            {isOpen && (
                                <ul className="dropdown-list open">
                                    <li className="dropdown-item" onClick={() => handleItemClick(' Woman')}>
                                        Woman
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemClick(' Man')}>
                                        Man
                                    </li>
                                </ul>
                            )}
                        </div>

                        <div className="toggle-dropdown">
                            <button className="toggle-button" onClick={toggleDropdownReligin}>
                                {isOpenReligin ? (
                                    <>
                                        {itemReligin ? itemReligin : "Religion"}  <i className="bi bi-chevron-up chevron"></i>
                                    </>
                                ) : (
                                    <>
                                        {itemReligin ? itemReligin : "Religion"} <i className="bi bi-chevron-down chevron"></i>
                                    </>
                                )}
                            </button>
                            {isOpenReligin && (
                                <ul className="dropdown-list open">
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Hindu')}>
                                        Hindu
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Muslim')}>
                                        Muslim
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Buddhist')}>
                                        Buddhist
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Jain')}>
                                        Jain
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Jewish')}>
                                        Jewish
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Sikh')}>
                                        Sikh
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' Cristian')}>
                                        Cristian
                                    </li>
                                    <li className="dropdown-item" onClick={() => handleItemReligionClick(' No Religion')}>
                                        No Religion
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>

                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='First Name' onChange={(e) => setFirst(e.target.value)} value={first} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Middel Name' onChange={(e) => setMiddel(e.target.value)} value={middel} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Last Name' onChange={(e) => setLast(e.target.value)} value={last} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Mobile Number' onChange={(e) => setMobile(e.target.value)} value={mobile} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Work or Job' onChange={(e) => setWork(e.target.value)} value={Work} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Height' onChange={(e) => setHeight(e.target.value)} value={height} />


                    <div className='b-date-wedding-div mb-2'>

                        <span className='dark:text-darkPostText text-2xl me-4'>D/B :-</span>

                        <div className="toggle-dropdown ">
                            <button className="date-toggle-button " onClick={toggleDropdownDay}>
                                {isDay ? (
                                    <>
                                        {itemDay ? itemDay : "Day"}
                                    </>
                                ) : (
                                    <>
                                        {itemDay ? itemDay : "Day"}
                                    </>
                                )}
                            </button>

                            {isDay && (
                                <div className="date-dropdown-list open bg-border dark:bg-dark dark:text-darkProfileName">
                                    {days.map((day) => (
                                        <span
                                            key={day}
                                            className="date-dropdown-item "
                                            onClick={() => handleItemDayClick(day.toString())}
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            )}

                        </div>

                        <div className="toggle-dropdown">
                            <button className="date-toggle-button" onClick={toggleDropdownMonth}>
                                {isMonth ? (
                                    <>
                                        {selectedMonth ? selectedMonth : "Month"}
                                    </>
                                ) : (
                                    <>
                                        {selectedMonth ? selectedMonth : "Month"}
                                    </>
                                )}
                            </button>
                            {isMonth && (
                                <ul className="date-dropdown-list open bg-border dark:bg-dark dark:text-darkProfileName">
                                    {months.map((month) => (
                                        <li
                                            key={month}
                                            className="date-dropdown-item"
                                            onClick={() => handleItemMonthClick(month)}
                                        >
                                            {month}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="toggle-dropdown">
                            <button className="date-toggle-button" onClick={toggleDropdownYear}>
                                {isYear ? (
                                    <>
                                        {selectedYear ? selectedYear : "Year"}
                                    </>
                                ) : (
                                    <>
                                        {selectedYear ? selectedYear : "Year"}
                                    </>
                                )}
                            </button>
                            {isYear && (
                                <ul className="date-dropdown-list open bg-border dark:bg-dark dark:text-darkProfileName">
                                    {years.map((year) => (
                                        <li
                                            key={year}
                                            className="date-dropdown-item"
                                            onClick={() => handleItemYearClick(year.toString())}
                                        >
                                            {year}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                    </div>

                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Qualification' onChange={(e) => setQualification(e.target.value)} value={qualification} />

                    {/* <input type="text" className='wedding-input'
                        placeholder='Salary' onChange={(e) => setSalary(e.target.value)} value={salary} /> */}


                    <h4 className='text-2xl mb-3 dark:text-darkPostText'>Address</h4>
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Landmark' onChange={(e) => setLandmark(e.target.value)} value={landmark} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='Village' onChange={(e) => setVillage(e.target.value)} value={village} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='District' onChange={(e) => setDistric(e.target.value)} value={distric} />
                    <input type="text" className='wedding-input dark:bg-darkInput dark:text-darkPostText'
                        placeholder='State' onChange={(e) => setState(e.target.value)} value={state} />

                    <h3 className='text-2xl dark:text-darkPostText'>Photo</h3>

                    <div className='wedding-photo-container'>
                        {photo ?
                            <label htmlFor="photo">
                                <div>
                                    <img src={URL.createObjectURL(photo)} className='wedding-photo' alt="" />
                                </div>
                            </label>
                            :
                            <label htmlFor="photo">
                                <div className='wedding-photo-div'>
                                    <i className="bi bi-image-fill wedding-add-photo"></i>
                                </div>
                            </label>
                        }
                        <input type="file" id='photo' style={{ display: "none" }} onChange={(e) => setPhoto(e.target.files[0])} />

                        <input type="file" id='photoTwo' style={{ display: "none" }} onChange={(e) => setPhotoTwo(e.target.files[0])} />


                    </div>

                    <div className="btn  btn-success my-4 w-100" style={{ fontSize: "18px", position:"relative", zIndex:"9999" }} onClick={Save}>Save</div>
                </div>
            </div >
        </>
    )
}

export default Wedding

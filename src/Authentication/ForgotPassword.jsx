import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import vlogo from "./../Image/img/logo192.png";
import "./Forgot.scss";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [error, setError] = useState('');

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
            setError('');
        } catch (error) {
            setResetEmailSent(false);
            console.log(error.message)

            if (error.code === "auth/user-not-found") {
                setError('invalid email address.');
            }
        }
    };

    return (
        <div>
            <div className="forgot-back-div">
                <i onClick={goBack} style={{cursor:"pointer"}} className="bi bi-arrow-left forgoten-icon"></i>
            </div>
            {resetEmailSent ? (
                <>
                    <form onSubmit={handleResetPassword} className='forgot-wrapper'>
                        <div className="forgotten-div w3-animate-right">
                            <div className='d-flex align-items-center justify-content-center'>
                                <img src={vlogo} width={"45px"} alt="vchat logo" />
                                <div className='login-title'>VChat App</div>
                            </div>
                            <input
                                type="email"
                                className="forgot-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className='reset-send'>A password reset email, has been sent to your email address.</div>
                            {error && <div className='error'>{error}</div>}
                            <button style={{ borderRadius: "30px", fontSize: "18px", padding: "4px 10px" }} className='btn btn-primary mt-4'>Reset Password</button>
                        </div>
                    </form>
                </>
            ) : (
                <form onSubmit={handleResetPassword} className='forgot-wrapper'>
                    <div className="forgotten-div w3-animate-right">
                        <div className='d-flex align-items-center justify-content-center'>
                            <img src={vlogo} width={"45px"} alt="vchat logo" />
                            <div className='login-title'>VChat App</div>
                        </div>
                        <input
                            type="email"
                            className="forgot-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {error && <div className='error'>{error}</div>}

                        <button style={{ borderRadius: "30px", fontSize: "18px", padding: "4px 10px" }} className='btn btn-primary mt-4'>Reset Password </button>
                    </div>
                </form>
            )}


            <div className='forgott-footer-bottom'>Copyright © VChat App 2023. </div>
        </div>
    );
};

export default ForgotPassword;

import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

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
                <i onClick={goBack} className="bi bi-arrow-left forgoten-icon"></i>
            </div>
            {resetEmailSent ? (
                <>
                    <form onSubmit={handleResetPassword} className='forgot-wrapper'>
                        <div className="forgotten-div w3-animate-right">
                            <h3 className='login-title'>Mininsta</h3>
                            <input
                                type="email"
                                className='login-input-new '
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <div className='reset-send'>A password reset email, has been sent to your email address.</div>
                            {error && <div className='error'>{error}</div>}
                            <button type="submit" className='btn btn-primary-custom mt-3'>Reset Password</button>
                        </div>
                    </form>
                </>
            ) : (
                <form onSubmit={handleResetPassword} className='forgot-wrapper'>
                    <div className="forgotten-div w3-animate-right">
                        <h3 className='login-title'>Mininsta</h3>
                        <input
                            type="email"
                            className='login-input-new '
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {error && <div className='error'>{error}</div>}
                        <button type="submit" className='btn btn-primary-custom mt-3'>Reset Password</button>
                    </div>
                </form>
            )}


            <div className='forgott-footer-bottom'>Copyright © Ajay Anandaro 2023. </div>
        </div>
    );
};

export default ForgotPassword;

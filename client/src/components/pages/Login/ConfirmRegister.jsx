import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmRegister = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Registration Successful!</h2>
            <p>Thank you for registering. Please check your email to confirm your account.</p>
            <button onClick={handleLoginRedirect} style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}>
                Go to Login
            </button>
        </div>
    );
}

export default ConfirmRegister;

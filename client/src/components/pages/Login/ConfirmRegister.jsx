import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmRegister = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const confirmRegistration = async () => {
        const response = await fetch("https://blogs-donex-backend.vercel.app/api/auth/confirm-register");
        const data = await response.json();
        console.log(data);
    }

    useEffect(()=>{
        confirmRegistration()
    },[])

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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        
        if (!email.trim() || !password) {
            setError('Please enter both email and password');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store user data and token
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                console.log('Login successful');
                navigate('/dashboard');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && <div className="error-message">{error}</div>}
            <button 
                type="button" 
                className="login-button"
                onClick={login}
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Log in'}
            </button>
        </>
    );
}

export default LoginButton;
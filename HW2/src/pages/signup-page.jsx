import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLogin from '../components/google-login.jsx';

const clientId = "GOOGLE_CLIENT_ID";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('Signup data:', formData);
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const data = await response.json();
      console.log('Signup response:', JSON.stringify(data));
      localStorage.setItem('user', JSON.stringify(data));

      window.location.href = '/dashboard';
    } catch (error) {
      setError('Signup failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="welcome-page">
        <div className="content">
          <div className="title">CLike</div>
          <div className="subtitle">Join our community today.</div>
        </div>
        <form className="main-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-field"
            id="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="form-field"
            id="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="form-field"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="form-field"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-button">
            Sign Up
          </button>

          <div className="login-link">
            Already have an account? <a href="/">Log in</a>
          </div>

          <GoogleLogin mode='signup' />
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
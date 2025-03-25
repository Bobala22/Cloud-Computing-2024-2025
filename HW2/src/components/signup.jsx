import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpButton() {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    
    navigate('/sign-up');
  };

  return (
    <div>
      Don't have an account? <a href="/sign-up" onClick={handleClick}>Sign up!</a>
    </div>
  );
}

export default SignUpButton;
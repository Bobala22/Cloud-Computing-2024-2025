import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function GoogleLogout({ onLogoutSuccess }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    
    if (onLogoutSuccess) {
      onLogoutSuccess();
    }
    
    navigate('/');
    
    console.log('Logged out successfully');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Log Out
    </button>
  );
}

export default GoogleLogout;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Home: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/'); // Redirect to login page if not authenticated
  }

  return (
    <div className='bg-home'>
      <h1>Welcome, {user?.email}!</h1>
      <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
    </div>
  );
};

export default Home;

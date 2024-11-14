import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm/AuthForm';
import Home from './components/Home/Home';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className='main'>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

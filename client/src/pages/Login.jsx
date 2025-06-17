// src/pages/Login.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // simulate login success
    localStorage.setItem('token', 'example-token');
    navigate('/dashboard');
  };

  return (
    <>
    <div className="content">
      <div className="left">
        <h1>Task Manager</h1>
        <p>Manage all your tasks in one place!</p>
      </div>
      <div className="right">
        <div className="login-box">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <div className='form'>
           <button
           className=''
            type="submit"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
          <div/>
        </div>
      </div>
    </div>
    <div/></div>
    </>
  );
};

export default Login;

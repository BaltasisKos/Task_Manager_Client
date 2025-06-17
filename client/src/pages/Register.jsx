import React from 'react';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('token', 'example-token');
    navigate('/');
  };

  return (
    <>
    <div className="container">
      <div className="form-wrapper">
        <h2 className="title">Create Account</h2>
        <form className="form" onSubmit={handleRegister}>
          <input type="text" placeholder="Username" className="input" />
          <input type="email" placeholder="Email" className="input" />
          <input type="password" placeholder="Password" className="input" />
          <button type="submit" className="button">
            Register
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;

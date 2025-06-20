// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Register from './pages/Register';
import ParticlesComponent from './components/Particles';

function App() {
  return (
    <div className="App">
      <ParticlesComponent id="particles" />
      <div className="content">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;

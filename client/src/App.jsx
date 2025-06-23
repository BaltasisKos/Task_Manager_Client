// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ParticlesComponent from './components/Particles';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <ParticlesComponent id="particles" />
      <div className="content">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />   
           
            <Route path="/dashboard" element={<Dashboard />}/>
          </Routes>


        </Router>
      </div>
    </div>
  );
}

export default App;

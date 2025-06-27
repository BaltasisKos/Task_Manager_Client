// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ParticlesComponent from './components/Particles';
import Dashboard from './pages/Dashboard';
import {Completed, Trash, InProgress, Tasks, Team, ToDo} from './pages';

function App() {
  return (
    <div className="App">
      <ParticlesComponent id="particles" />
      <div className="content">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />   
            
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="tasks" element={<Tasks/>}/>
            <Route path="completed" element={<Completed/>}/>
            <Route path="todo" element={<ToDo/>}/>
            <Route path="inProgress" element={<InProgress/>}/>
            <Route path="team" element={<Team/>}/>
            <Route path="trash" element={<Trash/>}/>
          </Routes>


        </Router>
      </div>
    </div>
  );
}

export default App;

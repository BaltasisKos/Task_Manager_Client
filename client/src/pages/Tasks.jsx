import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TasksTable from '../components/TasksTable';

const Tasks = () => {
  return (
    <div className="flex h-screen w-screen bg-neutral-100 overflow-hidden">
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Content below the header */}
        <div className="flex-1 flex  overflow-auto p-6 bg-gradient-to-r from-blue-700 to-blue-400">
          <TasksTable />
        </div>
      </div>
    </div>
  );
};

export default Tasks;

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TodoTasksTable from '../components/TodoTasksTable';

const ToDo = () => {
  return (
    <div className="flex h-screen w-screen bg-neutral-100 overflow-hidden">
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Content below the header */}
        <div className="flex-1 flex  overflow-auto p-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-400">
          <TodoTasksTable />
        </div>
      </div>
    </div>
  );
};

export default ToDo;

import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InProgressTasksTable from '../components/InProgressTaskTable';

const InProgress = () => {
  return (
    <div className="flex h-screen w-screen bg-neutral-100 overflow-hidden">
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        {/* Content below the header */}
        <div className="flex-1 flex  overflow-auto p-6">
          <InProgressTasksTable />
        </div>
      </div>
    </div>
  );
};

export default InProgress;

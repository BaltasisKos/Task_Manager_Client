// src/components/CompletedTasksTable.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const InProgressTasksTable = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress');

  return (
    <div className="w-full py-5 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">In Progress</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>
      </div>

      <div className="overflow-x-auto shadow-2xl rounded">
          <table className="min-w-full bg-white">
            <thead>
              <tr className='bg-gradient-to-r from-cyan-500 to-cyan-400'>
                <th className="p-3 border-b text-center">Task Title</th>
                <th className="p-3 border-b text-center">Status</th>
                <th className="p-3 border-b text-center">Team</th>
                <th className="p-3 border-b text-center">Created At</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
    {inProgressTasks.length === 0 ? (
      <tr>
        <td colSpan={5} className="p-4 text-center text-gray-500">
          No completed tasks found.
        </td>
      </tr>
    ) : (
      inProgressTasks.map((task) => (
        <tr key={task.id} className="border-b">
          <td className="p-2">{task.title}</td>
          <td className="p-2">{task.team || '—'}</td>
          <td className="p-2">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
          </td>
          <td className="p-2 whitespace-pre-wrap break-words">{task.notes || '—'}</td>
        </tr>
      ))
    )}
  </tbody>
          </table>
        </div>
        </div>

  );
};

export default InProgressTasksTable;

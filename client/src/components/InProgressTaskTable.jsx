// src/components/CompletedTasksTable.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const InProgressTasksTable = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress');

  return (
    <div className="w-full py-10 px-4">
      <div className="flex justify-center mb-4">
        <h2 className="text-xl mb-8 font-semibold text-gray-700">
          In Progress Tasks
        </h2>
      </div>

      <div className="overflow-x-auto shadow-2xl">
          <table className="min-w-full border border-gray-300 rounded">
            <thead>
              <tr>
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

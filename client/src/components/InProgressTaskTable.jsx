// src/components/InProgressTasksTable.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const InProgressTasksTable = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const inProgressTasks = tasks.filter((task) => task.status === 'inProgress');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">In Progress Tasks</h2>
      {inProgressTasks.length > 0 ? (
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Task Title</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {inProgressTasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50 text-gray-800">
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-6 py-4">{task.team || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No in-progress tasks found.</p>
      )}
    </div>
  );
};

export default InProgressTasksTable;

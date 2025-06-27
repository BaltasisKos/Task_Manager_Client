// src/components/CompletedTasksTable.jsx
import React from 'react';

// Dummy data - replace with real data or fetch from context/API
const completedTasks = [
  { id: 1, title: 'Fix login bug', dueDate: '2025-06-25', assignee: 'Alice' },
  { id: 2, title: 'Submit report', dueDate: '2025-06-26', assignee: 'Bob' },
  { id: 3, title: 'Finalize design', dueDate: '2025-06-27', assignee: 'Charlie' },
];

const CompletedTasksTable = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Completed Tasks</h2>
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
          <tr>
            <th className="px-6 py-3">Task</th>
            <th className="px-6 py-3">Due Date</th>
            <th className="px-6 py-3">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {completedTasks.map((task) => (
            <tr key={task.id} className="border-b hover:bg-gray-50 text-gray-800">
              <td className="px-6 py-4">{task.title}</td>
              <td className="px-6 py-4">{task.dueDate}</td>
              <td className="px-6 py-4">{task.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedTasksTable;

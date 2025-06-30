// src/components/CompletedTasksTable.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const CompletedTasksTable = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <div className="p-6">
  <div className="flex justify-center mb-4">
    <h2 className="text-2xl font-semibold text-gray-700">
      Completed Tasks
    </h2>
  </div>

  {completedTasks.length > 0 ? (
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
          <tr
            key={task.id}
            className="border-b hover:bg-gray-50 text-gray-800"
          >
            <td className="px-6 py-4">{task.title}</td>
            <td className="px-6 py-4">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "—"}
            </td>
            <td className="px-6 py-4">{task.team || "Unassigned"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-gray-500">No completed tasks found.</p>
  )}
</div>

  );
};

export default CompletedTasksTable;

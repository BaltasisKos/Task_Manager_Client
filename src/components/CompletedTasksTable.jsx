import React from "react";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

const CompletedTasksTable = () => {
  // ✅ Fetch tasks from backend
  const { data: tasks = [], isLoading, isError } = useGetAllTaskQuery();

  if (isLoading) return <p className="text-white">Loading completed tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="w-full py-5 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-12">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Completed</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>
      </div>

      <div className="overflow-x-auto shadow-2xl rounded">
          <table className="min-w-full bg-white">
            <thead>
              <tr className='bg-gradient-to-r from-cyan-500 to-cyan-400'>
                <th className="p-3 border-b border-b-blue-700 text-center">Task Title</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Status</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Team</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Created At</th>
                <th className="p-3 border-b border-b-blue-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
    {completedTasks.length === 0 ? (
      <tr>
        <td colSpan={5} className="p-4 text-center text-gray-500">
          No completed tasks found.
        </td>
      </tr>
    ) : (
      completedTasks.map((task) => (
        <tr key={task._id} >
          <td className="p-2">{task.name}</td>
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

export default CompletedTasksTable;

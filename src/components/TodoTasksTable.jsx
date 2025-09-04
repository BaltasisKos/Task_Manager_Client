import React from "react";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

const ToDoTasksTable = () => {
  // ✅ Fetch tasks directly from backend
  const { data: tasks = [], isLoading, isError } = useGetAllTaskQuery();

  if (isLoading) return <p className="text-white">Loading tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  const todoTasks = tasks.filter((task) => task.status === "todo");

  return (
    <div className="w-full py-5 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-14 mb-12">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Todo</h2>
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
    {todoTasks.length === 0 ? (
      <tr>
        <td colSpan={5} className="p-4 text-center text-gray-500">
          No todo tasks found.
        </td>
      </tr>
    ) : (
      todoTasks.map((task) => (
        <tr key={task._id} className="border-b">
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

export default ToDoTasksTable;

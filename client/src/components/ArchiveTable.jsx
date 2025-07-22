// components/ArchivedTasksTable.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  restoreTask,
  permanentlyDeleteTask,
} from "../store/taskSlice"; // adjust path if needed

const ArchiveTable = () => {
  const dispatch = useDispatch();

  // Get all deleted tasks from Redux state
  const archivedTasks = useSelector((state) =>
    state.tasks.tasks.filter((task) => task.deleted === true)
  );

  const handleRestore = (id) => {
    dispatch(restoreTask(id));
  };

  const handlePermanentDelete = (id) => {
    dispatch(permanentlyDeleteTask(id));
  };

  return (
    <div className="w-full py-5 px-4">
      <h2 className="flex justify-start text-2xl font-bold mb-4">Archived Tasks</h2>
      <div className="overflow-x-auto shadow-2xl rounded">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-center">Title</th>
              <th className="p-3 border-b text-center">Status</th>
              <th className="p-3 border-b text-center">Team</th>
              <th className="p-3 border-b text-center">Due Date</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archivedTasks.length > 0 ? (
              archivedTasks.map((task) => (
                <tr key={task.id} className="text-center border-t">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.status}</td>
                  <td className="p-3">{task.team}</td>
                  <td className="p-3">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleRestore(task.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(task.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No archived tasks.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArchiveTable;

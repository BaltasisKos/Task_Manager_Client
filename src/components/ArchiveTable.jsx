import React, { useState } from "react";
import {
  useGetAllTaskQuery,
  useDeleteTaskMutation,
  useRestoreTaskMutation,
  useSoftDeleteTaskMutation,
} from "../redux/slices/api/taskApiSlice";
import { RotateCw, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";


const ArchiveTable = () => {
  const { data: tasks = [], isLoading, isError } = useGetAllTaskQuery();
  const [restoreTask] = useRestoreTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [restoreConfirmId, setRestoreConfirmId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");

  const archivedTasks = tasks.filter((task) => task.status === "deleted");

  const handleRestore = async (id) => {
  try {
    await restoreTask(id).unwrap();
    toast.success("Task restored!");
    setRestoreConfirmId(null); // close modal
  } catch (err) {
    console.error(err);
    toast.error("Failed to restore task");
  }
};


  const handlePermanentDelete = async (id) => {
    await deleteTask(id);
  };

  if (isLoading) return <p className="text-white">Loading tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <div className="w-full py-5 px-4">
      {/* Table header */}
      <div className="flex items-center gap-14 mb-12">
        <div className="flex-grow border-t border-white"></div>
        <h2 className="text-2xl font-bold text-white">Archive</h2>
        <div className="flex-grow border-t border-white"></div>
      </div>

      <div className="overflow-x-auto shadow-2xl rounded">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-500 to-cyan-400">
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
                <tr key={task._id} className="text-center border-t">
                  <td className="p-3">{task.name}</td>
                  <td className="p-3">{task.status}</td>
                  <td className="p-3">{task.team}</td>
                  <td className="p-3">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => setRestoreConfirmId(task._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCw size={16} /> Restore
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(task._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={16} /> Delete
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

      {/* Restore modal */}
      {restoreConfirmId && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Restore</h2>
            <p className="mb-6">Are you sure you want to restore this task?</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={async () => {
                  await handleRestore(restoreConfirmId);
                  setRestoreConfirmId(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setRestoreConfirmId(null)} // just close modal
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 cursor-pointer"
              >
                No
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Permanent delete modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="absolute top-4 right-4 text-black hover:text-cyan-500 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
            <p className="mb-6">
              Please type "<strong>permanently delete</strong>" to confirm deletion:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Type here"
            />
            <div className="flex justify-center gap-2">
              <button
                disabled={confirmationText.toLowerCase() !== "permanently delete"}
                onClick={async () => {
                  await handlePermanentDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                  setConfirmationText("");
                }}
                className={`px-4 py-2 rounded-4xl cursor-pointer text-white ${
                  confirmationText.toLowerCase() === "permanently delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveTable;

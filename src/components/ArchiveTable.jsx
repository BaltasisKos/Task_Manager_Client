// src/components/ArchiveTable.jsx
import React, { useState } from "react";
import {
  useGetAllTaskQuery,
  useDeleteTaskMutation,
  useRestoreTaskMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  useGetArchivedTeamsQuery,
  useDeleteTeamMutation,
  useRestoreTeamMutation,
  useGetTeamsQuery,
} from "../redux/slices/api/teamApiSlice";
import { RotateCw, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

const ArchiveTable = () => {
  // 🔹 Tasks
  const { data: tasks = [], isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks } =
    useGetAllTaskQuery();
  const [restoreTask] = useRestoreTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // 🔹 Teams (archived only)
  const { data: archivedTeams = [], isLoading: teamsLoading, isError: teamsError, refetch: refetchTeams } =
    useGetArchivedTeamsQuery();
  const [restoreTeam] = useRestoreTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  const { data: teamsData = [] } = useGetTeamsQuery();


  // Modals & confirmation
  const [restoreConfirm, setRestoreConfirm] = useState({ type: "", id: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ type: "", id: null });
  const [confirmationText, setConfirmationText] = useState("");

  // Archived Tasks
  const archivedTasks = tasks.filter((task) => task.status === "deleted");

  // Handlers
  const handleRestore = async (type, id) => {
    try {
      if (type === "task") await restoreTask(id).unwrap();
      if (type === "team") await restoreTeam(id).unwrap();

      toast.success(`${type === "task" ? "Task" : "Team"} restored!`);
      setRestoreConfirm({ type: "", id: null });

      // Refetch to update table immediately
      if (type === "task") refetchTasks();
      if (type === "team") refetchTeams();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to restore ${type}`);
    }
  };

  const handlePermanentDelete = async (type, id) => {
    try {
      if (type === "task") await deleteTask(id).unwrap();
      if (type === "team") await deleteTeam(id).unwrap();

      toast.success(`${type === "task" ? "Task" : "Team"} permanently deleted!`);
      setDeleteConfirm({ type: "", id: null });
      setConfirmationText("");

      // Refetch to update table immediately
      if (type === "task") refetchTasks();
      if (type === "team") refetchTeams();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to delete ${type}`);
    }
  };

  if (tasksLoading || teamsLoading)
    return <p className="text-white">Loading...</p>;
  if (tasksError || teamsError)
    return <p className="text-red-500">Error loading archive data</p>;

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="flex items-center gap-14 mb-12">
        <div className="flex-grow border-t border-white"></div>
        <h2 className="text-2xl font-bold text-white">Archive</h2>
        <div className="flex-grow border-t border-white"></div>
      </div>

      {/* Archived Tasks */}
      <h3 className="text-xl font-semibold mb-4 text-white">Tasks</h3>
      <div className="overflow-x-auto shadow-2xl rounded-lg mb-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-700">
              <th className="p-3 border-b text-center">Title</th>
              <th className="p-3 border-b text-center">Status</th>
              <th className="p-3 border-b text-center">Team</th>
              <th className="p-3 border-b text-center">Due Date</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archivedTasks.length ? (
              archivedTasks.map((task) => (
                <tr key={task._id} className="text-center border-b border-gray-600 hover:bg-blue-400">
                  <td className="p-3">{task.name}</td>
                  <td className="p-3">{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</td>
                  <td className="p-3">
                    {teamsData.find((t) => t._id === task.team)?.name || "-"}
                  </td>

                  <td className="p-3">{task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB") : "-"}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => setRestoreConfirm({ type: "task", id: task._id })}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCw size={16} /> Restore
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: "task", id: task._id })}
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

      {/* Archived Teams */}
      <h3 className="text-xl font-semibold mb-4 text-white">Teams</h3>
      <div className="overflow-x-auto shadow-2xl rounded-lg mb-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-700">
              <th className="p-3 border-b text-center">Team Name</th>
              <th className="p-3 border-b text-center">Description</th>
              <th className="p-3 border-b text-center">Members</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archivedTeams.length ? (
              archivedTeams.map((team) => (
                <tr key={team._id} className="text-center border-b border-gray-600 hover:bg-blue-400">
                  <td className="p-3">{team.name}</td>
                  <td className="p-3">{team.description || "-"}</td>
                  <td className="p-3">{team.members?.map((m) => m.name).join(", ") || "-"}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => setRestoreConfirm({ type: "team", id: team._id })}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCw size={16} />Restore
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: "team", id: team._id })}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={16} />Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No archived teams.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Restore Modal */}
      {restoreConfirm.id && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Restore</h2>
            <p className="mb-6">Are you sure you want to restore this {restoreConfirm.type}?</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleRestore(restoreConfirm.type, restoreConfirm.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setRestoreConfirm({ type: "", id: null })}
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {deleteConfirm.id && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl relative">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <button
              onClick={() => setDeleteConfirm({ type: "", id: null })}
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
                onClick={() => handlePermanentDelete(deleteConfirm.type, deleteConfirm.id)}
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

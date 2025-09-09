import React, { useState } from "react";
import { useGetAllTaskQuery, useSoftDeleteTaskMutation, useUpdateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { useGetTeamsQuery } from "../redux/slices/api/teamApiSlice";
import { Trash2, Check, Save, XCircle } from "lucide-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "sonner";

const ToDoTasksTable = () => {
  const { data: tasks = [], isLoading, isError, refetch } = useGetAllTaskQuery();
  const { data: teamsData = [] } = useGetTeamsQuery();

  const [updateTask] = useUpdateTaskMutation();
  const [softDeleteTask] = useSoftDeleteTaskMutation();

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const todoTasks = tasks.filter((task) => task.status === "todo");

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.name);
    setEditTeam(task.team || "");
    setEditNotes(task.notes || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditTeam("");
    setEditNotes("");
  };

  const saveEdit = async () => {
    try {
      await updateTask({
        _id: editId,
        name: editTitle,
        team: editTeam,
        notes: editNotes,
      }).unwrap();
      toast.success("Task updated");
      cancelEdit();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  const completeTask = async (task) => {
    try {
      await updateTask({
        _id: task._id,
        name: task.name,
        team: task.team,
        status: "completed",
        notes: task.notes || "",
      }).unwrap();
      toast.success("Task marked as completed");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await softDeleteTask(taskId).unwrap();
      toast.success("Task moved to archive");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  if (isLoading) return <p className="text-white">Loading tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-14 mb-12">
          <div className="flex-grow border-t border-white opacity-100"></div>
          <h2 className="text-2xl font-bold text-white whitespace-nowrap">Todo</h2>
          <div className="flex-grow border-t border-white opacity-100"></div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-2xl rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-700">
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
                <tr key={task._id} className="border-b border-gray-600 hover:bg-blue-400">
                  <td className="p-2 text-center">
                    {editId === task._id ? (
                      <TextField
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      task.name
                    )}
                  </td>

                  <td className="p-2 capitalize text-center">{task.status}</td>

                  <td className="p-2 text-center">
                    {editId === task._id ? (
                      <TextField
                        select
                        value={editTeam}
                        onChange={(e) => setEditTeam(e.target.value)}
                        size="small"
                        fullWidth
                      >
                        {teamsData.map((t) => (
                          <MenuItem key={t._id} value={t._id}>
                            {t.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      teamsData.find((t) => t._id === task.team)?.name || "—"
                    )}
                  </td>

                  <td className="p-2 text-center">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-GB") : "—"}
                  </td>

                  {/* Actions */}
                  <td className="p-2 text-center flex justify-center items-center">
                    <button
                      onClick={() => completeTask(task)}
                      className="flex items-center gap-1 bg-green-400 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      <Check size={16} /> Complete
                    </button>
                  </td>
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

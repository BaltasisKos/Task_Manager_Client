import React, { useState } from "react";
import { useGetAllTaskQuery, useSoftDeleteTaskMutation, useUpdateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { useGetTeamsQuery } from "../redux/slices/api/teamApiSlice";
import { Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

const CompletedTasksTable = () => {
  const { data: tasks = [], isLoading, isError, refetch } = useGetAllTaskQuery();
  const { data: teamsData = [] } = useGetTeamsQuery();

  const [updateTask] = useUpdateTaskMutation();
  const [softDeleteTask] = useSoftDeleteTaskMutation();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    team: "",
    status: "completed",
    dueDate: null,
    notes: "",
  });

  const completedTasks = tasks.filter((task) => task.status === "completed");

  const openEditModal = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.name,
      team: task.team || "",
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      notes: task.notes || "",
    });
    setShowTaskModal(true);
  };

  const closeEditModal = () => {
    setEditingTask(null);
    setShowTaskModal(false);
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

  if (isLoading) return <p className="text-white">Loading completed tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-grow border-t border-white opacity-100"></div>
          <h2 className="text-2xl font-bold text-white whitespace-nowrap">Completed</h2>
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
            {completedTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No completed tasks found.
                </td>
              </tr>
            ) : (
              completedTasks.map((task) => (
                <tr key={task._id} className="border-b border-gray-600 hover:bg-blue-400">
                  <td className="p-2 text-center">{task.name}</td>
                  <td className="p-2 capitalize text-center">{task.status}</td>
                  <td className="p-2 text-center">{teamsData.find((t) => t._id === task.team)?.name || "—"}</td>
                  <td className="p-2 text-center">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer"
                    >
                      <Check size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {showTaskModal && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowTaskModal(false)}
        >
          <div
            className="relative bg-white rounded p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-black hover:text-cyan-500"
            >
              ✖
            </button>

            <h3 className="text-lg font-semibold text-center mb-4">Edit Task</h3>

            <TextField
              label="Title"
              value={taskForm.title}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              variant="filled"
              fullWidth
              margin="dense"
            />

            <TextField
              select
              label="Team"
              value={taskForm.team}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, team: e.target.value }))}
              fullWidth
              variant="filled"
              margin="dense"
            >
              {teamsData.map((t) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              value={taskForm.status}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, status: e.target.value }))}
              fullWidth
              variant="filled"
              margin="dense"
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>

            <div className="mt-3 mb-3">
              <label className="text-sm font-medium mb-1 flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-gray-500" /> Due Date
              </label>
              <DatePicker
                selected={taskForm.dueDate}
                onChange={(date) => setTaskForm((prev) => ({ ...prev, dueDate: date }))}
                className="border p-2 rounded w-full"
                dateFormat="dd/MM/yyyy"
                isClearable
              />
            </div>

            <TextField
              multiline
              rows={4}
              label="Notes"
              value={taskForm.notes}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, notes: e.target.value }))}
              variant="filled"
              fullWidth
              margin="dense"
            />

            <div className="flex justify-center mt-4 gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateTask({
                      _id: editingTask._id,
                      name: taskForm.title,
                      team: taskForm.team,
                      status: taskForm.status,
                      dueDate: taskForm.dueDate ? taskForm.dueDate.toISOString() : null,
                      notes: taskForm.notes,
                    }).unwrap();
                    toast.success("Task updated");
                    setShowTaskModal(false);
                    setEditingTask(null);
                    refetch();
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to update task");
                  }
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTasksTable;

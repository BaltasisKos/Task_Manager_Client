import React, { useState } from "react";
import {
  CalendarDays,
  Check,
  Save,
  XCircle,
  MoreVertical,
  ClipboardList,
  Clock,
  ListTodo,
  Plus,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "sonner";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useGetAllTaskQuery,
  useSoftDeleteTaskMutation,
} from "../redux/slices/api/taskApiSlice";

const TasksTable = () => {
  // --- Queries & Mutations ---
  const { data: tasks = [], isLoading, isError } = useGetAllTaskQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [softDeleteTask] = useSoftDeleteTaskMutation();

  // --- State ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("allTasks");

  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(null);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [titleError, setTitleError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editStatus, setEditStatus] = useState("todo");
  const [editDueDate, setEditDueDate] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  // --- Stats ---
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "inProgress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    deleted: tasks.filter((t) => t.status === "deleted").length,
  };

  const boxes = [
    {
      key: "allTasks",
      label: "All Tasks",
      value: stats.total,
      icon: <ClipboardList className="text-blue-500" />,
      bg: "bg-blue-50 rounded",
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: stats.inProgress,
      icon: <Clock className="text-yellow-500" />,
      bg: "bg-yellow-50 rounded",
    },
    {
      key: "todo",
      label: "To Do",
      value: stats.todo,
      icon: <ListTodo className="text-purple-500" />,
      bg: "bg-purple-50 rounded",
    },
  ];

  // --- Filtered Tasks ---
  const filteredTasks = tasks.filter((task) =>
    selectedFilter === "allTasks"
      ? task.status !== "deleted"
      : task.status === selectedFilter && task.status !== "deleted"
  );

  // --- Handlers ---
  const resetAddForm = () => {
    setTitle("");
    setTeam("");
    setStatus("todo");
    setDueDate(null);
    setCreatedAt(new Date());
    setNotes("");
    setTitleError("");
  };

  const handleAddTask = async () => {
    if (!title.trim()) return setTitleError("Title is required.");
    try {
      await createTask({
        name: title,
        team,
        status,
        createdAt: createdAt.toISOString(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        notes,
      }).unwrap();
      toast.success("Task added");
      resetAddForm();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add task");
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditTitle(task.name);
    setEditTeam(task.team || "");
    setEditStatus(task.status);
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setEditNotes(task.notes || "");
    setTitleError("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditTeam("");
    setEditStatus("todo");
    setEditDueDate(null);
    setEditNotes("");
    setTitleError("");
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return setTitleError("Title is required.");
    try {
      await updateTask({
        _id: editId,
        name: editTitle,
        team: editTeam,
        status: editStatus,
        dueDate: editDueDate ? editDueDate.toISOString() : null,
        notes: editNotes,
      }).unwrap();
      toast.success("Task updated");
      cancelEdit();
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
        dueDate: task.dueDate || null,
        notes: task.notes || "",
      }).unwrap();
      toast.success("Task completed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete task");
    }
  };

  const confirmDeleteTask = async () => {
  if (!deleteConfirmId) return;
  console.log("Deleting task ID:", deleteConfirmId); // 🔍
  try {
    await softDeleteTask(deleteConfirmId).unwrap();
    toast.success("Task moved to archive");
    setDeleteConfirmId(null);
  } catch (err) {
    console.error(err); // shows 404 here
    toast.error("Failed to delete task");
  }
};


  if (isLoading) return <p className="text-white">Loading tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="flex items-center gap-14 mb-10">
        <div className="flex-grow border-t border-white"></div>
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <div className="flex-grow border-t border-white"></div>
      </div>

      {/* Add Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={() => setShowAddModal(true)}
          className="border text-white px-6 py-2 rounded hover:bg-cyan-400 flex items-center gap-1 cursor-pointer"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {boxes.map((box) => (
          <button
            key={box.key}
            onClick={() => setSelectedFilter(box.key)}
            className={`p-4 flex items-center justify-between shadow ${box.bg} w-full`}
          >
            <div className="text-3xl">{box.icon}</div>
            <div className="flex-1 text-left pl-4">
              <div className="text-gray-700 text-sm">{box.label}</div>
            </div>
            <div className="text-xl">
              <Plus size={24} className="text-blue-500" />
            </div>
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-6">
        {filteredTasks.map((task) => (
          <div key={task._id} className="relative rounded shadow-2xl p-4 bg-white">
            {/* Dropdown */}
            <div className="absolute top-2 right-2">
              <button
                onClick={() =>
                  setDropdownOpenId(dropdownOpenId === task._id ? null : task._id)
                } className="cursor-pointer"
              >
                <MoreVertical size={20} />
              </button>
              {dropdownOpenId === task._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                  <button
                    onClick={() => {
                      setDropdownOpenId(null);
                      startEdit(task);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpenId(null);
                      setDeleteConfirmId(task._id);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-500 hover:text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Task Info */}
            <table className="table-fixed w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td colSpan={2} className="text-center text-xl font-semibold py-6">
                    {editId === task._id ? (
                      <>
                        <input
                          className="border p-1 w-full rounded"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        {titleError && <p className="text-sm text-red-500">{titleError}</p>}
                      </>
                    ) : (
                      task.name
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-2">Team:</th>
                  <td className="p-2">
                    {editId === task._id ? (
                      <input
                        className="border p-1 w-full rounded"
                        value={editTeam}
                        onChange={(e) => setEditTeam(e.target.value)}
                      />
                    ) : (
                      task.team || "—"
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-2">Status:</th>
                  <td className="p-2 capitalize">
                    {editId === task._id ? (
                      <select
                        className="border p-1 w-full rounded"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="inProgress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-2">Due Date:</th>
                  <td className="p-2">
                    {editId === task._id ? (
                      <DatePicker
                        selected={editDueDate}
                        onChange={setEditDueDate}
                        className="border p-1 w-full rounded"
                        dateFormat="dd/MM/yyyy"
                        isClearable
                      />
                    ) : task.dueDate ? (
                      new Date(task.dueDate).toLocaleDateString()
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="text-left p-2">Notes:</th>
                  <td className="p-2 whitespace-pre-wrap break-words">
                    {editId === task._id ? (
                      <textarea
                        className="border p-1 w-full rounded resize-none"
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    ) : (
                      task.notes || ""
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Actions */}
            <div className="flex justify-center mt-4 gap-2">
              {editId === task._id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => completeTask(task)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                >
                  <Check size={16} /> Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative bg-white rounded p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-black hover:text-cyan-500"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">Add Task</h3>

            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="filled"
              fullWidth
              margin="dense"
              sx={{ backgroundColor: "white", "& .MuiFilledInput-root": { backgroundColor: "white" } }}
            />
            {titleError && <p className="text-sm text-red-500 mb-2">{titleError}</p>}

            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <TextField
                label="Team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                variant="filled"
                fullWidth
                sx={{ backgroundColor: "white", "& .MuiFilledInput-root": { backgroundColor: "white" } }}
              />
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                variant="filled"
                sx={{ backgroundColor: "white", "& .MuiInputBase-root": { backgroundColor: "white" } }}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="inProgress">In Progress</MenuItem>
              </TextField>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              <div className="w-full">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" /> Created Date
                </label>
                <DatePicker
                  selected={createdAt}
                  onChange={setCreatedAt}
                  className="border p-2 rounded w-full"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
              <div className="w-full">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" /> Due Date
                </label>
                <DatePicker
                  selected={dueDate}
                  onChange={setDueDate}
                  className="border p-2 rounded w-full"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
            </div>

            <TextField
              multiline
              rows={4}
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="filled"
              fullWidth
              sx={{ backgroundColor: "white", "& .MuiFilledInput-root": { backgroundColor: "white", paddingTop: "26px" } }}
            />

            <div className="flex justify-center mt-4">
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white px-16 py-2 rounded-4xl hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to move this task to the archive?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

export default TasksTable;

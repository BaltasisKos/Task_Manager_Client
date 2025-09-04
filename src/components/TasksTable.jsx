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

import { useGetTeamsQuery } from "../redux/slices/api/teamApiSlice";

const TasksTable = () => {
  // --- Queries & Mutations ---
  const { data: tasks = [], isLoading, isError } = useGetAllTaskQuery();
  const { data: teamsData = [] } = useGetTeamsQuery(); // fetch teams
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
  const [teamMembers, setTeamMembers] = useState([]);

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
    setTeamMembers([]);
  };

  const handleAddTask = async () => {
    if (!title.trim()) return setTitleError("Title is required.");
    try {
      await createTask({
        name: title,
        team,
        members: teamMembers, // automatically assign team members
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

  const handleTeamChange = (teamId) => {
    setTeam(teamId);
    const selectedTeam = teamsData.find((t) => t._id === teamId);
    setTeamMembers(selectedTeam?.members || []);
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
    try {
      await softDeleteTask(deleteConfirmId).unwrap();
      toast.success("Task moved to archive");
      setDeleteConfirmId(null);
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
      <div className="flex items-center gap-14 mb-10">
        <div className="flex-grow border-t border-white"></div>
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <div className="flex-grow border-t border-white"></div>
      </div>

      {/* Add Task Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={() => setShowAddModal(true)}
          className="border text-white px-6 py-2 rounded hover:bg-cyan-400 flex items-center gap-1 cursor-pointer"
        >
          <Plus size={18} /> Add Task
        </button>
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
            />
            {titleError && <p className="text-sm text-red-500 mb-2">{titleError}</p>}

            <TextField
              select
              label="Team"
              value={team}
              onChange={(e) => handleTeamChange(e.target.value)}
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              variant="filled"
              margin="dense"
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
            </TextField>

            <div className="flex gap-4 mt-3 mb-3">
              <div className="flex-1">
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
              <div className="flex-1">
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
              margin="dense"
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
    </div>
  );
};

export default TasksTable;

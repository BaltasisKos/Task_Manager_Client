// src/components/DashStats.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  deleteTask,
  editTask,
  setSelectedFilter,
} from "../store/taskSlice";
import {
  CheckCircle,
  Clock,
  ClipboardList,
  ListTodo,
  Save,
  XCircle,
  Edit2,
  Trash2,
  CalendarDays,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const DashStats = () => {
  const dispatch = useDispatch();
  const { tasks, selectedFilter, stats } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(null);
  const [createdAt, setCreatedAt] = useState(new Date()); // NEW
  const [notes, setNotes] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editStatus, setEditStatus] = useState("todo");

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const boxes = [
    {
      key: "allTasks",
      label: "All Tasks",
      value: stats.total,
      icon: <ClipboardList className="text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      key: "completed",
      label: "Completed",
      value: stats.completed,
      icon: <CheckCircle className="text-green-500" />,
      bg: "bg-green-50",
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: stats.inProgress,
      icon: <Clock className="text-yellow-500" />,
      bg: "bg-yellow-50",
    },
    {
      key: "todo",
      label: "To Do",
      value: stats.todo,
      icon: <ListTodo className="text-purple-500" />,
      bg: "bg-purple-50",
    },
  ];

  const filteredTasks =
    selectedFilter === "allTasks"
      ? tasks
      : tasks.filter((t) => t.status === selectedFilter);

  const handleAddTask = () => {
    if (!title.trim()) return;
    dispatch(
      addTask({
        title,
        status,
        team,
        createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString(),
        dueDate: dueDate ? dueDate.toISOString() : null,
        notes,
      })
    );
    setTitle("");
    setStatus("todo");
    setTeam("");
    setDueDate(null);
    setCreatedAt(new Date());
    setNotes("");
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditTeam(task.team || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditStatus("todo");
    setEditTeam("");
  };

  const saveEdit = () => {
    dispatch(
      editTask({
        id: editId,
        title: editTitle,
        status: editStatus,
        team: editTeam,
      })
    );
    cancelEdit();
  };

  const filterLabels = boxes.reduce((acc, box) => {
    acc[box.key] = box.label;
    return acc;
  }, {});

  return (
    <div className="relative">
      {/* Create Task Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {boxes.map((box) => (
          <button
            key={box.key}
            onClick={() => dispatch(setSelectedFilter(box.key))}
            className={`p-4 rounded-xl shadow flex items-center gap-4 shadow-2xl ${box.bg} ${
              selectedFilter === box.key
                ? "ring-2 ring-blue-400 ring-opacity-50"
                : "hover:ring-2 hover:ring-blue-300"
            } transition`}
          >
            <div className="text-3xl">{box.icon}</div>
            <div className="text-left">
              <div className="text-gray-700 text-sm">{box.label}</div>
              <div className="text-xl font-semibold">{box.value}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="mb-6">
        <h2 className="text-xl mb-8 font-semibold">
          {filterLabels[selectedFilter] || "All Tasks"}
        </h2>

        <div className="overflow-x-auto rounded border shadow-2xl">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 border-b text-center">Task Title</th>
                <th className="p-3 border-b text-center">Status</th>
                <th className="p-3 border-b text-center">Team</th>
                <th className="p-3 border-b text-center">Created At</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    {editId === task.id ? (
                      <>
                        <td className="p-3 border-b">
                          <input
                            type="text"
                            className="border p-1 rounded w-full"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-b">
                          <select
                            className="border p-1 rounded w-full"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                          >
                            <option value="todo">To Do</option>
                            <option value="inProgress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-3 border-b">
                          <input
                            type="text"
                            className="border p-1 rounded w-full"
                            value={editTeam}
                            onChange={(e) => setEditTeam(e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-b">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="p-3 border-b">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={saveEdit}
                              className="flex items-center gap-2 bg-green-600 text-white px-2 py-1 rounded cursor-pointer"
                            >
                              <Save size={16} /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-2 bg-gray-400 text-white px-2 py-1 rounded cursor-pointer"
                            >
                              <XCircle size={16} /> Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 border-b">{task.title}</td>
                        <td className="p-3 border-b capitalize">{task.status}</td>
                        <td className="p-3 border-b">{task.team || "—"}</td>
                        <td className="p-3 border-b">
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="p-3 border-b">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => startEdit(task)}
                              className="flex items-center gap-2 bg-blue-600 text-white px-2 py-1 rounded cursor-pointer"
                            >
                              <Edit2 size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <input
              type="text"
              className="border p-2 rounded w-full mb-3"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* Team & Status Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              {/* Team Name */}
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1">Team</label>
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Team name"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="border p-2 rounded w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>


            {/* Date Pickers Row: Created Date (left) & Due Date (right) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              {/* Created Date */}
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  Created Date
                </label>
                <DatePicker
                  selected={createdAt}
                  onChange={(date) => setCreatedAt(date)}
                  className="border p-2 rounded w-full"
                  placeholderText="Select created date"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>

              {/* Due Date */}
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  Due Date
                </label>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  className="border p-2 rounded w-full"
                  placeholderText="Select due date"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
            </div>


            {/* Notes */}
            <textarea
              className="border p-2 rounded w-full mb-4 h-24 resize-none"
              placeholder="Task notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddTask();
                  setShowModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashStats;

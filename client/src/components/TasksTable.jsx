import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTask,
 softDeleteTask,
  editTask,
} from "../store/taskSlice";
import {
  CalendarDays,
  Check,
  Edit2,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TasksTable = () => {
  const dispatch = useDispatch();
  const { tasks, selectedFilter } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(null);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editStatus, setEditStatus] = useState("todo");
  const [editDueDate, setEditDueDate] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  const [titleError, setTitleError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredTasks = (() => {
  if (selectedFilter === "allTasks") {
    // Show all except completed
    return tasks.filter(t => t.status !== "completed");
  }
  return tasks.filter((t) => t.status === selectedFilter);
})();


  const handleAddTask = () => {
    if (!title.trim()) {
      setTitleError("Title is required.");
      return;
    }
    dispatch(
      addTask({
        title,
        status,
        team,
        createdAt: createdAt.toISOString(),
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
    setTitleError("");
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
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

  const saveEdit = () => {
    if (!editTitle.trim()) {
      setTitleError("Title is required.");
      return;
    }
    dispatch(
      editTask({
        id: editId,
        title: editTitle,
        status: editStatus,
        team: editTeam,
        dueDate: editDueDate ? editDueDate.toISOString() : null,
        notes: editNotes,
      })
    );
    cancelEdit();
  };

  const completeTask = (task) => {
    dispatch(
      editTask({
        id: task.id,
        status: "completed",
        title: task.title,
        team: task.team || "",
        notes: task.notes || "",
        dueDate: task.dueDate || null,
      })
    );
  };

  return (
    <div className="w-full py-10 px-4">
    {filteredTasks.length === 0 ? (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        {/* Centered Create Button with No Tasks */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create New Task
        </button>
        <span className="text-gray-500 mt-4">No tasks found.</span>
      </div>
    ) : (
      <div className="mb-6">
        {/* Top-Left Create Button when tasks exist */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create New Task
        </button>
      </div>
    )}

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="rounded shadow-2xl p-4 bg-white">
            <table className="table-fixed w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <th className="text-left p-2 w-1/3">Title:</th>
                  <td className="p-2">
                    {editId === task.id ? (
                      <>
                        <input
                          className="border p-1 w-full rounded"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        {titleError && (
                          <p className="text-sm text-red-500">{titleError}</p>
                        )}
                      </>
                    ) : (
                      task.title
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <th className="text-left p-2">Team:</th>
                  <td className="p-2">
                    {editId === task.id ? (
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
                    {editId === task.id ? (
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
                    {editId === task.id ? (
                      <DatePicker
                        selected={editDueDate}
                        onChange={setEditDueDate}
                        className="border p-1 w-full rounded"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select due date"
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
                    {editId === task.id ? (
                      <textarea
                        className="border p-1 w-full rounded resize-none break-words"
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    ) : task.notes ? (
                      task.notes
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mt-3">
              {editId === task.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(task)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(task.id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button
                    onClick={() => completeTask(task)}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    <Check size={16} /> Complete
                  </button>
                </>
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
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <input
              type="text"
              className="border p-2 rounded w-full mb-3"
              placeholder="Task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
            />
            {titleError && <p className="text-sm text-red-500 mb-2">{titleError}</p>}

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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAddTask();
                  if (!titleError) setShowAddModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteTask(deleteConfirmId));
                  setDeleteConfirmId(null);
                }}
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

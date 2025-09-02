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
import { CheckCircle, Clock, ClipboardList, ListTodo, Plus, MoreVertical } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import TeamsTable from '../components/TeamsTable'
import { toast } from "sonner"



const TasksTable = () => {
  const dispatch = useDispatch();
  const { tasks, selectedFilter, stats } = useSelector((state) => state.tasks);

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
    return tasks.filter(t => t.status !== "completed" && !t.deleted);
  }
  return tasks.filter((t) => t.status === selectedFilter && !t.deleted);
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

  const boxes = [
      {
        key: "allTasks",
        label: "All Tasks",
        value: stats.total,
        icon: <ClipboardList className="text-blue-500" />,
        bg: "bg-blue-50 rounded",
      },
      // {
      //   key: "completed",
      //   label: "Completed",
      //   value: stats.completed,
      //   icon: <CheckCircle className="text-green-500" />,
      //   bg: "bg-green-50 rounded",
      // },
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

    const [dropdownOpenId, setDropdownOpenId] = useState(null);


  return (
    <div className="w-full py-5 px-4">
      <div className="flex items-center gap-14 mb-6">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Tasks</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>
    {filteredTasks.length === 0 ? (
      <div className="flex justify-start mb-4">
        {/* Centered Create Button with No Tasks */}
        <i class="fas fa-plus"></i>
        <button
          onClick={() => setShowAddModal(true)}
          className="border text-white px-6 py-2 rounded hover:bg-blue-500 cursor-pointer flex items-center gap-1 "
          >
          <Plus size={18}/>
          Add Task
          </button>

      </div>
    ) : (
      <div className="mb-6 flex justify-start">
        {/* Top-Left Create Button when tasks exist */}
        <button
          onClick={() => setShowAddModal(true)}
          className="border text-white px-6 py-2 rounded hover:bg-cyan-400 cursor-pointer flex items-center gap-1"
        >
          <Plus size={18}/>
          Add Task
        </button>
      </div>
    )}

      {/* Stats Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
              {boxes.map((box) => (
                <button
                  key={box.label}
                  onClick={() => dispatch(setSelectedFilter())}
                  className={`p-4 flex items-center justify-between shadow ${box.bg} w-full`}
                >
                  {/* Left Icon */}
                  <div className="text-3xl">{box.icon}</div>

                  {/* Center Label */}
                  <div className="flex-1 text-left pl-4">
                    <div className="text-gray-700 text-sm">{box.label}</div>
                  </div>

                  {/* Right Plus Icon */}
                  <div className="text-xl">
                    <Plus size={24} className="text-blue-500" />
                  </div>
                </button>

              ))}
            </div>


      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="relative rounded shadow-2xl p-4 bg-white">
            {/* Dropdown menu */}
            <div className="absolute top-2 right-2">
              <button onClick={() => setDropdownOpenId(dropdownOpenId === task.id ? null : task.id)}>
                <MoreVertical size={20}  className='cursor-pointer'/>
              </button>
              {dropdownOpenId === task.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10 ">
                  <button
                    onClick={() => {
                      setDropdownOpenId(null);
                      startEdit(task);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpenId(null);
                      setDeleteConfirmId(task.id);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-500 hover:text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <table className="table-fixed w-full border-collapse">
              <tbody>
                <tr className="border-b ">
                  {/* <th className="text-left p-10">Title:</th> */}
                  <td colSpan={2} className='text-center text-xl font-semibold py-6'>
                    {editId === task.id ? (
                      <>
                        <input
                          className="border p-1 w-full rounded "
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
                      ""
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

             {/* Actions */}
            <div className="flex justify-center mt-4 gap-2">
              {editId === task.id ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 flex items-center gap-1 cursor-pointer"
                  >

                    <XCircle size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {completeTask(task), toast.success("Task Completed");}}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer flex items-center gap-1"
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
            {/* Close Icon in Top-Right */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-black hover:text-cyan-500"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl cursor-pointer" />
            </button>

            {/* Centered Title */}
            <h3 className="text-lg font-semibold text-center mb-4">Add Task</h3>

            {/* Input Field */}
            <TextField
                  required
                  label="Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value )}
                  variant="filled"
                  fullWidth
                  margin="dense"
                  sx={{
                  backgroundColor: 'white', // sets the background
                  '& .MuiFilledInput-root': {
                  backgroundColor: 'white', // targets the input field itself
                },
              }}
                /> 

            {titleError && <p className="text-sm text-red-500 mb-2">{titleError}</p>}

            {/* Team & Status Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              {/* Team Name */}
              <div className="w-full sm:w-1/2">
                <TextField
                      required
                      label="Team"
                      type="text"
                      value={team}
                      onChange={(e) => setTeam(e.target.value )}
                      variant="filled"
                      fullWidth
                      margin="dense"
                      sx={{
                      backgroundColor: 'white', // sets the background
                      '& .MuiFilledInput-root': {
                      backgroundColor: 'white', // targets the input field itself
                    },
                  }}
                    />
              </div>

              {/* Status */}
              <div className="w-full sm:w-1/2">
                <TextField
                  required
                  select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                  margin="dense"
                  variant="filled"
                  sx={{
                    backgroundColor: 'white',
                    '& .MuiInputBase-root': {
                      backgroundColor: 'white',
                    },
                  }}
                >
                  <MenuItem value="" disabled >Select status:</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                </TextField>
  
              </div>
            </div>

            {/* Date Pickers Row: Created Date (left) & Due Date (right) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-3">
              {/* Created Date */}
              <div className="w-full sm:w-1/2">
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
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
                <label className="text-sm font-medium mb-1 flex items-center gap-1">
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
            <TextField
              id="standard-multiline-static"
              label="Write your notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              marigin="dense"
              variant="filled"
              fullWidth
              sx={{
                fontSize: '1rem',
                backgroundColor: 'white',
                '& .MuiFilledInput-root': {
                  fontSize: '1rem',
                  paddingTop: '26px',
                  backgroundColor: 'white',
                },
              }}
            />

            <div className="flex justify-center mt-4">
              
              <button
                onClick={() => {
                  handleAddTask();
                  toast.success("Task successfully added");
                  if (!titleError) setShowAddModal(false);
                }}
                className="bg-blue-600 text-white px-16 py-2 rounded-4xl hover:bg-blue-700 cursor-pointer"
              >
                Add
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
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(softDeleteTask(deleteConfirmId));
                  setDeleteConfirmId(null);
                  toast.success("Task successfully deleted");
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
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

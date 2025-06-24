import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask, editTask, setSelectedFilter } from "../store/taskSlice";
import { CheckCircle, Clock, ClipboardList, ListTodo } from "lucide-react";

const DashStats = () => {
  const dispatch = useDispatch();
  const { tasks, selectedFilter, stats } = useSelector((state) => state.tasks);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");

   // For editing:
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("todo");

  const boxes = [
    {
      key: "total",
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
    selectedFilter === "total"
      ? tasks
      : tasks.filter((t) => t.status === selectedFilter);

  const handleAddTask = () => {
    if (!title.trim()) return;
    dispatch(addTask({ title, status }));
    setTitle("");
    setStatus("todo");
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditStatus("todo");
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    dispatch(editTask({ id: editId, title: editTitle, status: editStatus }));
    cancelEdit();
  };

  return (
    <div>
      {/* Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {boxes.map((box) => (
          <button
            key={box.key}
            onClick={() => dispatch(setSelectedFilter(box.key))}
            className={`
              p-4 rounded-xl shadow flex items-center gap-4
              ${box.bg}
              ${
                selectedFilter === box.key
                  ? "ring-4 ring-blue-400 ring-opacity-50"
                  : "hover:ring-2 hover:ring-blue-300"
              }
              transition
            `}
          >
            <div className="text-3xl">{box.icon}</div>
            <div className="text-left">
              <div className="text-gray-700 text-sm">{box.label}</div>
              <div className="text-xl font-semibold">{box.value}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="mb-6">
        <h2 className="text-xl mb-2">
          Showing: {selectedFilter === "total" ? "All Tasks" : selectedFilter}
        </h2>
        <ul className="list-disc list-inside min-h-[100px] space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between">
                {editId === task.id ? (
                  <div className="flex gap-2 items-center flex-1">
                    <input
                      type="text"
                      className="border p-1 rounded flex-grow"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <select
                      className="border p-1 rounded"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>
                      {task.title} — <em>{task.status}</em>
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <li>No tasks found.</li>
          )}
        </ul>
      </div>


      {/* Add Task form */}
      <div className="border p-4 rounded-lg shadow-md max-w-md">
        <h3 className="text-lg font-semibold mb-3">Add New Task</h3>
        <input
          type="text"
          className="border p-2 rounded w-full mb-3"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default DashStats;

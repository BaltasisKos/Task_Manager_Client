import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editTask } from "../store/taskSlice";

const TodoTasksTable = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const todoTasks = tasks.filter((task) => task.status === "todo");

  // Track which task is editing and store temporary edits
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editDueDate, setEditDueDate] = useState(null);

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditTeam(task.team || "");
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditTeam("");
    setEditDueDate(null);
  };

  const saveEdit = () => {
    dispatch(
      editTask({
        id: editId,
        title: editTitle.trim() || "Untitled",
        team: editTeam.trim() || "Unassigned",
        status: "todo",
        dueDate: editDueDate ? editDueDate.toISOString() : null,
      })
    );
    cancelEdit();
  };

  const completeTask = (task) => {
    dispatch(
      editTask({
        id: task.id,
        title: task.title,
        team: task.team || "Unassigned",
        status: "completed",
        dueDate: task.dueDate || null,
      })
    );
    // Optionally, you could navigate or scroll to completed section here if needed
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">To Do Tasks</h2>

      {todoTasks.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-6">
          {todoTasks.map((task) => (
            <table
              key={task.id}
              className="min-w-[300px] bg-white rounded-lg shadow-md overflow-hidden border text-sm"
            >
              <thead className="bg-gray-100 text-left text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-2">Task</th>
                  <th className="px-4 py-2">Start</th>
                  <th className="px-4 py-2">Due</th>
                  <th className="px-4 py-2">Team</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {editId === task.id ? (
                  <tr className="border-t text-gray-800">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="border rounded p-1 w-full"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        className="border rounded p-1 w-full"
                        value={
                          editDueDate
                            ? editDueDate.toISOString().substring(0, 10)
                            : ""
                        }
                        onChange={(e) =>
                          setEditDueDate(
                            e.target.value ? new Date(e.target.value) : null
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        className="border rounded p-1 w-full"
                        value={editTeam}
                        onChange={(e) => setEditTeam(e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr className="border-t hover:bg-gray-50 text-gray-800">
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">{task.team || "Unassigned"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => completeTask(task)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No to do tasks found.</p>
      )}
    </div>
  );
};

export default TodoTasksTable;

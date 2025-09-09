import React, { useState } from "react";
import { useGetAllTaskQuery, useUpdateTaskMutation } from "../redux/slices/api/taskApiSlice";
import { useGetTeamsQuery } from "../redux/slices/api/teamApiSlice";
import { Check } from "lucide-react";
import { toast } from "sonner";

const InProgressTasksTable = () => {
  const { data: tasks = [], isLoading, isError, refetch } = useGetAllTaskQuery();
  const { data: teamsData = [] } = useGetTeamsQuery();

  const [updateTask] = useUpdateTaskMutation();

  const inProgressTasks = tasks.filter((task) => task.status === "inProgress");

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

  if (isLoading) return <p className="text-white">Loading tasks...</p>;
  if (isError) return <p className="text-red-500">Error loading tasks</p>;

  return (
    <div className="w-full py-5 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-14 mb-12">
          <div className="flex-grow border-t border-white opacity-100"></div>
          <h2 className="text-2xl font-bold text-white whitespace-nowrap">In Progress</h2>
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
            {inProgressTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No in-progress tasks found.
                </td>
              </tr>
            ) : (
              inProgressTasks.map((task) => (
                <tr key={task._id} className="border-b border-gray-600 hover:bg-blue-400">
                  <td className="p-2 text-center">{task.name}</td>
                  <td className="p-2 capitalize text-center">{task.status}</td>
                  <td className="p-2 text-center">{teamsData.find((t) => t._id === task.team)?.name || "—"}</td>
                  <td className="p-2 text-center">{task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="p-2 text-center flex justify-center items-center">
                    <button
                      onClick={() => completeTask(task)}
                      className="flex  items-center gap-1 bg-green-400 text-white px-3 py-1 rounded cursor-pointer"
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

export default InProgressTasksTable;

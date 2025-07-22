import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedFilter } from "../store/taskSlice";
import { CheckCircle, Clock, ClipboardList, ListTodo } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import TasksTable from "../components/TasksTable";
import TeamsTable from "../components/TeamsTable";

const DashStats = () => {
  const dispatch = useDispatch();
  const { tasks, selectedFilter, stats } = useSelector((state) => state.tasks);

  const [timeView, setTimeView] = useState("month");

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

  const chartData = [
    {
      name: "All",
      count: tasks.filter((t) => !t.deleted).length,
    },
    {
      name: "To Do",
      count: tasks.filter((t) => t.status === "todo" && !t.deleted).length,
    },
    {
      name: "In Progress",
      count: tasks.filter((t) => t.status === "inProgress" && !t.deleted).length,
    },
    {
      name: "Completed",
      count: tasks.filter((t) => t.status === "completed" && !t.deleted).length,
    },
  ];

  return (
    <div className="relative mt-4">
      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {boxes.map((box) => (
          <button
            key={box.key}
            onClick={() => dispatch(setSelectedFilter(box.key))}
            className={`p-4 flex items-center gap-4 shadow ${box.bg} ${
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

      {/* Time Range Selector */}
      <div className="flex items-center justify-end mb-2 gap-2">
        <button
          onClick={() => setTimeView("week")}
          className={`px-3 py-1 rounded border ${
            timeView === "week" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setTimeView("month")}
          className={`px-3 py-1 rounded border ${
            timeView === "month" ? "bg-blue-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          Month
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two tables side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TasksTable />
        <TeamsTable />
      </div>
    </div>
  );
};

export default DashStats;

import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedFilter } from "../redux/slices/taskSlice";
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
import { CheckCircle, Clock, ClipboardList, ListTodo } from "lucide-react";

// ✅ RTK Query hook
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

const DashStats = () => {
  const dispatch = useDispatch();
  const { data: tasks = [] } = useGetAllTaskQuery(); // fetch tasks automatically

  const boxes = [
    {
      key: "allTasks",
      label: "All Tasks",
      value: tasks.length,
      icon: <ClipboardList className="text-blue-500" />,
      bg: "bg-blue-50 rounded",
    },
    {
      key: "completed",
      label: "Completed",
      value: tasks.filter((t) => t.status === "completed").length,
      icon: <CheckCircle className="text-green-500" />,
      bg: "bg-green-50 rounded",
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: tasks.filter((t) => t.status === "inProgress").length,
      icon: <Clock className="text-yellow-500" />,
      bg: "bg-yellow-50 rounded",
    },
    {
      key: "todo",
      label: "To Do",
      value: tasks.filter((t) => t.status === "todo").length,
      icon: <ListTodo className="text-purple-500" />,
      bg: "bg-purple-50 rounded",
    },
  ];

  const chartData = [
    { name: "All", count: tasks.length },
    { name: "To Do", count: tasks.filter((t) => t.status === "todo").length },
    { name: "In Progress", count: tasks.filter((t) => t.status === "inProgress").length },
    { name: "Completed", count: tasks.filter((t) => t.status === "completed").length },
  ];

  return (
    <div className="w-full py-10 px-4">
      <div className="mb-12 flex items-center gap-14 ">
        <div className="flex-grow border-t border-white opacity-100"></div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Dashboard</h2>
        <div className="flex-grow border-t border-white opacity-100"></div>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {boxes.map((box) => (
          <button
            key={box.key}
            onClick={() => dispatch(setSelectedFilter(box.key))}
            className={`p-4 flex flex-col items-center gap-2 shadow ${box.bg} transition hover:scale-[1.02]`}
          >
            <div className="text-3xl">{box.icon}</div>
            <div className="text-center">
              <div className="text-gray-700 text-sm">{box.label}</div>
              <div className="text-2xl font-bold">{box.value}</div>
            </div>
          </button>
        ))}
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
    </div>
  );
};

export default DashStats;

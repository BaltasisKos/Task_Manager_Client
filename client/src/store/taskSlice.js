import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  selectedFilter: "total",
  stats: { total: 0, todo: 0, inProgress: 0, completed: 0 },
};

const updateStats = (tasks) => {
  return {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "inProgress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.tasks.push(action.payload);
        state.stats = updateStats(state.tasks);
      },
      prepare({ title, status, team, dueDate, createdAt, notes }) {
        return {
          payload: {
            id: nanoid(),
            title,
            status,
            team: team || "Unassigned",
            dueDate: dueDate || null,
            createdAt: createdAt || new Date().toISOString(),
            notes: notes || "",
          },
        };
      },
    },

    deleteTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.stats = updateStats(state.tasks);
    },

    editTask(state, action) {
      const { id, title, status, team, dueDate, notes } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        task.title = title;
        task.status = status;
        task.team = team;
        task.dueDate = dueDate || null;
        task.notes = notes || "";
        state.stats = updateStats(state.tasks);
      }
    },

    setSelectedFilter(state, action) {
      state.selectedFilter = action.payload;
    },
  },
});

export const { addTask, deleteTask, editTask, setSelectedFilter } = taskSlice.actions;
export default taskSlice.reducer;

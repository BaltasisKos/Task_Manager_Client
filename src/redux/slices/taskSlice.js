import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  selectedFilter: "allTasks",
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
        state.stats = updateStats(state.tasks.filter((t) => !t.deleted));
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
            deleted: false,
          },
        };
      },
    },

    softDeleteTask(state, action) {
      const task = state.tasks.find((t) => t._id === action.payload);
      if (task) {
        task.deleted = true;
        state.stats = updateStats(state.tasks.filter((t) => !t.deleted));
      }
    },

    restoreTask(state, action) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.deleted = false;
        state.stats = updateStats(state.tasks.filter((t) => !t.deleted));
      }
    },

    permanentlyDeleteTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      state.stats = updateStats(state.tasks.filter((t) => !t.deleted));
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
        state.stats = updateStats(state.tasks.filter((t) => !t.deleted));
      }
    },

    setSelectedFilter(state, action) {
      state.selectedFilter = action.payload;
    },
  },
});

export const {
  addTask,
  softDeleteTask,
  restoreTask,
  permanentlyDeleteTask,
  editTask,
  setSelectedFilter,
} = taskSlice.actions;

export default taskSlice.reducer;
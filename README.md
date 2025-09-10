# Task Manager

Task Manager is a final exam project for Coding Factory 7 of Athens Univercity of Economic Bussines. A modern React application designed to manage personal or team tasks in an intuitive and efficient way. It provides a user-friendly interface to create, update, and organize tasks, with real-time syncing via an API backend.

---

## Table of Contents

- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Setup & Development](#setup--development)  
- [Project Structure](#project-structure)  
- [How to Use](#how-to-use)  
- [Deployment](#deployment)  
- [Build](#build)  
- [Screenshots & Demo](#screenshots--demo)  
- [Contributing](#contributing)  
- [License](#license)

---

## Features

- Create, update, and delete tasks  
- Organize tasks by status or priority  
- Responsive, mobile-friendly interface  
- API integration for real-time task syncing  
- Optimized for speed and developer productivity with Vite  

---

## Technology Stack

- React  
- React Router  
- Axios  
- Tailwind CSS  
- Vite  
- JavaScript / TypeScript  

---

## Setup & Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/BaltasisKos/Task_Manager_Client.git
   cd Task_Manager_Client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000).  
   The app will auto-refresh on file changes.  

---

## Project Structure

```
Task_Manager_Client/
├── public/                # Static assets
├── src/                   # Application source code
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components (views)
│   ├── services/          # API calls and data fetching
│   ├── styles/            # Global styles (if any)
│   └── main.jsx           # Application entry point
├── .gitignore             # Ignored files and folders for Git
├── README.md              # Project documentation
├── eslint.config.js       # ESLint configuration
├── index.html             # Main HTML file
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Dependency lock file
└── vite.config.js         # Vite configuration
```

---

## How to Use

1. **Add a Task**  
   Enter task details (title, description, etc.) and assign status or priority.  

2. **Update Task**  
   Edit existing tasks; changes sync in real-time via the backend API.  

3. **Delete Task**  
   Remove tasks with one click.  

4. **Organize Tasks**  
   Filter or group tasks by status or priority; fully responsive for mobile and desktop.  

---

## Deployment

To prepare the app for deployment (e.g., Netlify, Vercel, GitHub Pages):  

```bash
npm run build
```

The command will generate an optimized production build inside the `dist/` folder.  

Deploy the contents of `dist/` to your hosting platform.  

---

## Build

Available npm scripts:  

- **Development build**

  ```bash
  npm run dev
  ```

- **Production build**

  ```bash
  npm run build
  ```

- **Preview production build locally**

  ```bash
  npm run preview
  ```

---



# 📝 MERN Stack Task Manager

A professional, full-stack Todo application built with the **MERN** (MongoDB, Express, React, Node.js) stack. This project features a secure REST API with JWT authentication and a responsive React frontend.

## 🚀 Features
- **User Authentication:** Secure Sign-up and Login using JWT and Bcrypt password hashing.
- **Task Management:** Full CRUD (Create, Read, Update, Delete) functionality.
- **Smart Filtering:** Filter tasks by status (All, Completed, Pending).
- **Search & Sort:** Search through tasks and sort them chronologically via backend queries.
- **Environment Security:** Secured sensitive data using `.env` variables.
- **Responsive Design:** Clean and modern UI that works on all screen sizes.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Axios (for API calls)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), Dotenv
- **State Management:** React Hooks (`useState`, `useEffect`)

---

## 📁 Project Structure
```text
Project_To_Do/
├── Project_To_Do_Backend/    # Express Server & MongoDB API
│   ├── controllers/          # Business logic for endpoints
│   ├── models/               # Mongoose Schemas (User, Todo)
│   ├── routes/               # API Route definitions
│   ├── middlewares/          # Auth security layers
│   └── server.js             # Entry point
├── Project_To_Do_Frontend/   # Vite + React UI
│   ├── src/
│   │   ├── api/              # Axios instance configuration
│   │   ├── components/       # UI Logic (Auth, TodoList)
│   │   └── App.jsx           # Main App Container
└── .env.example              # Template for environment variables

---

## ⚙️ Local Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the repository
```bash
git clone [https://github.com/Shubhammodi7/fullstack-todo-management.git](https://github.com/Shubhammodi7/fullstack-todo-management.git)
cd fullstack-todo-management

---

# Navigate to backend folder
cd Project_To_Do_Backend

# Install dependencies
npm install

# Create a .env file and add your credentials
# PORT=3000
# MONGO_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_secret_key
# FRONTEND_URL=http://localhost:5173

# Start the server
npm run dev

---

# Navigate to frontend folder (from root)
cd ../Project_To_Do_Frontend

# Install dependencies
npm install

# Create a .env file and add the API URL
# VITE_API_URL=http://localhost:3000/api

# Start the React app
npm run dev

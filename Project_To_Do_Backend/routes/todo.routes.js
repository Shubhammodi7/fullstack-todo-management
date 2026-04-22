const express = require('express');
const route = express.Router();

const {addTask, getAllTask, getTaskById, updateTaskById, toggleById, deleteById, getTaskByStatus} = require('../controllers/todo.controller')

const {authMiddleware} = require('../middlewares/auth.middleware')


// POST - http://localhost:3000/api/todos/add
route.post('/add', authMiddleware, addTask)

// http://localhost:3000/api/todos?sort=desc&page=2&limit=1
route.get('/', authMiddleware, getAllTask)

// http://localhost:3000/api/todos/status?status=completed
route.get('/status', authMiddleware, getTaskByStatus)

// http://localhost:3000/api/todos/69e755cb16b17c48f8da23b7
route.get('/:id', authMiddleware, getTaskById);

// http://localhost:3000/api/todos/update/69e755cb16b17c48f8da23b7
route.put("/update/:id", authMiddleware, updateTaskById)

// http://localhost:3000/api/todos/69e755cb16b17c48f8da23b7/toggle
route.patch('/:id/toggle', authMiddleware, toggleById)

// http://localhost:3000/api/todos/69e755cb16b17c48f8da23b7/
route.delete('/:id/delete', authMiddleware, deleteById)




module.exports = route;
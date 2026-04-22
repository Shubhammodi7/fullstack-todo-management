require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/user.routes')

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

const connectToDb = require('./config/db');
connectToDb();




app.use('/api/todos', todoRoutes);
app.use('/api/user', userRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

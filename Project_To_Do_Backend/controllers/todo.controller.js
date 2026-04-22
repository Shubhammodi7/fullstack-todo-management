const mongoose = require('mongoose');
const Todo = require('../models/todo.model');

// --- ADD TASK ---
const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Todo({
      title,
      description,
      user: userId
    });
    const response = await newTask.save();

    return res.status(200).json({
      success: true,
      message: "Task added to todoApp",
      task: response
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// --- GET ALL TASKS (with Search, Sort, Pagination) ---
const getAllTask = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let sortOption = {};
    sortOption.createdAt = sort === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const todos = await Todo.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalTodos = await Todo.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      total: totalTodos,
      page: Number(page),
      limit: Number(limit),
      todos // React frontend looks for this key
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// --- GET TASK BY ID ---
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const task = await Todo.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// --- UPDATE TASK ---
const updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id format" });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedTask = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, description, isCompleted },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({ success: true, message: "Task Updated", task: updatedTask });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- TOGGLE STATUS ---
const toggleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const task = await Todo.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.isCompleted = !task.isCompleted;
    await task.save();

    return res.status(200).json({ success: true, message: "Toggled successfully", task });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- DELETE TASK ---
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- GET BY STATUS (Fixed for Pending/Completed) ---
const getTaskByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    let queryStatus;
    if (status === 'completed') queryStatus = true;
    else if (status === 'pending') queryStatus = false;
    else return res.status(400).json({ message: "Invalid status" });

    // FIXED: Changed 'completed' to 'isCompleted' to match your schema
    const tasks = await Todo.find({
      user: req.user._id,
      isCompleted: queryStatus
    });

    res.status(200).json({ success: true, todos: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- EXPORTS ---
module.exports = {
  addTask,
  getAllTask,
  getTaskById,
  updateTaskById,
  toggleById,
  deleteById,
  getTaskByStatus
};
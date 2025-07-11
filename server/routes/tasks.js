const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { completed, priority, sort } = req.query;
    
    // Build filter object
    const filter = { user: req.user._id };
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sort === 'dueDate') {
      sortObj = { dueDate: 1, createdAt: -1 };
    } else if (sort === 'priority') {
      sortObj = { priority: -1, createdAt: -1 };
    } else if (sort === 'title') {
      sortObj = { title: 1 };
    }

    const tasks = await Task.find(filter).sort(sortObj);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

// Toggle task completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ message: 'Server error while toggling task' });
  }
});

module.exports = router;
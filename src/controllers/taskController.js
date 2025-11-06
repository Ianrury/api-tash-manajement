import { Task, User } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const getTasks = async (req, res) => {
  try {
    const { status, sort } = req.query;
    const userId = req.user.user_id;

    let whereClause = { user_id: userId };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    let orderClause = [['createdAt', 'DESC']];
    if (sort === 'deadline_asc') {
      orderClause = [['deadline', 'ASC NULLS LAST']];
    } else if (sort === 'deadline_desc') {
      orderClause = [['deadline', 'DESC NULLS LAST']];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: orderClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'name', 'username'],
        },
      ],
    });

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
    });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const task = await Task.findOne({
      where: {
        task_id: id,
        user_id: userId,
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'name', 'username'],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, description, status, deadline } = req.body;
    const userId = req.user.user_id;

    const task = await Task.create({
      user_id: userId,
      created_by: userId,
      title,
      description,
      status: status || 'To Do',
      deadline: deadline || null,
    });

    const newTask = await Task.findByPk(task.task_id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'name', 'username'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: newTask },
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const userId = req.user.user_id;
    const { title, description, status, deadline } = req.body;

    const task = await Task.findOne({
      where: {
        task_id: id,
        user_id: userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.update({
      title: title || task.title,
      description:
        description !== undefined ? description : task.description,
      status: status || task.status,
      deadline: deadline !== undefined ? deadline : task.deadline,
    });

    const updatedTask = await Task.findByPk(task.task_id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'name', 'username'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const task = await Task.findOne({
      where: {
        task_id: id,
        user_id: userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
    });
  }
};

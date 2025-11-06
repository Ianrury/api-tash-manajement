import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, username, password } = req.body;

    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    const user = await User.create({
      name,
      username,
      password,
    });

    const token = generateToken(user.user_id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          username: user.username,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};


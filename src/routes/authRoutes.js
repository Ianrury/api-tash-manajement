import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../middleware/validators.js';
import { protect } from '../middleware/Auth.js';

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     description: Membuat akun baru dengan name, username, dan password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, username, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ian Roery
 *               username:
 *                 type: string
 *                 example: ianroery
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User registered successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id: { type: integer, example: 1 }
 *                         name: { type: string, example: Ian Roery }
 *                         username: { type: string, example: ianroery }
 *                     token: { type: string, example: eyJhbGciOiJIUzI1NiIs... }
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', registerValidator, register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     description: Login menggunakan username dan password untuk mendapatkan JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: ianroery
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Login successful }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id: { type: integer, example: 1 }
 *                         name: { type: string, example: Ian Roery }
 *                         username: { type: string, example: ianroery }
 *                     token: { type: string, example: eyJhbGciOiJIUzI1NiIs... }
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', loginValidator, login);



export default router;

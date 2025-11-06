import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { taskValidator } from '../middleware/validators.js';
import { protect } from '../middleware/Auth.js';

const router = express.Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List semua task milik user yang sedang login
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, To Do, In Progress, Done]
 *         description: Filter berdasarkan status. Default tidak difilter (atau gunakan "all").
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [deadline_asc, deadline_desc]
 *         description: Urutkan berdasarkan deadline.
 *     responses:
 *       200:
 *         description: Daftar task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 2 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized (token tidak ada/invalid)
 *
 *   post:
 *     tags: [Tasks]
 *     summary: Buat task baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateInput'
 *     responses:
 *       201:
 *         description: Task berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Task created successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 */
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(taskValidator, createTask);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Ambil detail satu task milik user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID task
 *     responses:
 *       200:
 *         description: Detail task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task tidak ditemukan
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     tags: [Tasks]
 *     summary: Update task milik user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateInput'
 *     responses:
 *       200:
 *         description: Task berhasil diupdate
 *       400:
 *         description: Validasi gagal
 *       404:
 *         description: Task tidak ditemukan
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     tags: [Tasks]
 *     summary: Hapus task milik user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Task berhasil dihapus
 *       404:
 *         description: Task tidak ditemukan
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(getTask)
  .put(taskValidator, updateTask)
  .delete(deleteTask);

export default router;

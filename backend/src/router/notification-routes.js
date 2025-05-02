import { Router } from 'express';
import {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteUserNotification
} from '../controllers/notification-controller.js';
import {authenticate} from '../middlewares/auth.js';

const router = Router();

// Define as rotas para as notificações
router.post('/',authenticate, createNotification);
router.get('/user/:userId',authenticate, getUserNotifications);
router.patch('/:notificationId/read',authenticate, markNotificationAsRead);
router.delete('/:notificationId',authenticate, deleteUserNotification);

export default router;
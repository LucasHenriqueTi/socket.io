import { Router } from 'express';
import {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteUserNotification
} from '../controllers/notification-controller.js';
import {authenticate} from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

// Define as rotas para as notificações
router.post('/', createNotification);
router.get('/user/:userId', getUserNotifications);
router.patch('/:notificationId/read', markNotificationAsRead);
router.delete('/:notificationId', deleteUserNotification);

export default router;
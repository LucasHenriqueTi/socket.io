import express from 'express';
import { createUser, getUserDetails, getAllUsers, deleteAllUsers } from '../controllers/user-controller.js';
import { createForm, getFormDetails, getAllForms } from '../controllers/form-controller.js';
import { shareFormWithUser, getSharedFormsByUser } from '../controllers/shared-form-controller.js';

const router = express.Router();

// Rotas de Usuário
router.post('/users', createUser);
router.post('/delete-all', deleteAllUsers)
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);

// Rotas de Formulário
router.post('/forms', createForm);
router.get('/forms', getAllForms);
router.get('/forms/:formId', getFormDetails);

// Rotas de Compartilhamento
router.post('/share', shareFormWithUser);
router.get('/shared-forms/:userId', getSharedFormsByUser);

export default router;
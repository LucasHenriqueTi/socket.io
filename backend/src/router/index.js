import express from 'express';
import { createUser, getUserDetails } from '../controllers/user-controller.js';
import { createForm, getFormDetails, getAllForms } from '../controllers/form-controller.js';
import { shareFormWithUser, getSharedFormsByUser } from '../controllers/shared-form-controller.js';

const router = express.Router();

// Rotas de Usuário
router.post('/users', createUser);
router.get('/users/:userId', getUserDetails);

// Rotas de Formulário
router.get('/forms', getAllForms);
router.post('/forms', createForm);
router.get('/forms/:formId', getFormDetails);

// Rotas de Compartilhamento
router.post('/share', shareFormWithUser);
router.get('/shared-forms/:userId', getSharedFormsByUser);

export default router;
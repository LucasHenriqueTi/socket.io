import express from 'express';
import { createUser, getUserDetails, getAllUsers, deleteAllUsers } from '../controllers/user-controller.js';
import { createForm, getFormDetails, getAllForms } from '../controllers/form-controller.js';
import { shareFormWithUser, getSharedFormsByUser } from '../controllers/shared-form-controller.js';
import { login, authenticate } from '../middlewares/auth.js'; 


const router = express.Router();

// Rotas de Autenticação
router.post('/login', login); 

// Rotas de Usuário
router.post('/users',  createUser);
router.post('/delete-all',  deleteAllUsers)
router.get('/users',  getAllUsers);
router.get('/users/:userId', getUserDetails);

// Rotas de Formulário
router.post('/forms', createForm);
router.get('/forms', getAllForms);
router.get('/forms/:formId', getFormDetails);

// Rotas de Compartilhamento
router.post('/share', authenticate,shareFormWithUser);
router.get('/shared-forms/:userId', authenticate, getSharedFormsByUser);

export default router;
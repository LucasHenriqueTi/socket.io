import express from 'express';
import { createUser, getUserDetails, getAllUsers, deleteAllUsers } from '../controllers/user-controller.js';
import { createForm, getFormDetails, getAllForms } from '../controllers/form-controller.js';
import { shareFormWithUser, getSharedFormsByUser } from '../controllers/shared-form-controller.js';
import { login, authenticate } from '../middlewares/auth.js'; 


const router = express.Router();

// Rotas de Autenticação
router.post('/login', login); 

// Rotas de Usuário
router.post('/users',authenticate,  createUser);
router.post('/delete-all',authenticate,  deleteAllUsers)
router.get('/users',authenticate,  getAllUsers);
router.get('/users/:userId',authenticate, getUserDetails);

// Rotas de Formulário
router.post('/forms',authenticate, createForm);
router.get('/forms',authenticate, getAllForms);
router.get('/forms/:formId',authenticate, getFormDetails);

// Rotas de Compartilhamento
router.post('/share', authenticate,shareFormWithUser);
router.get('/shared-forms/:userId', authenticate, getSharedFormsByUser);

export default router;
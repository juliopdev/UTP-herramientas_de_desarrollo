import { Router } from 'express';
import { usersController } from './users.controller.js';

export const usersRouter = Router();

// Endpoints del módulo de Usuarios y Roles (Integrante 3)
usersRouter.get('/', usersController.list);
usersRouter.post('/', usersController.create);

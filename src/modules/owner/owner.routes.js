import { Router } from 'express';
import { ownerController } from './owner.controller.js';

export const ownerRouter = Router();

// Rutas del dashboard superadmin
ownerRouter.get('/', ownerController.renderDashboard);
ownerRouter.get('/api/health', ownerController.getHealth);

import express from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} from '../controllers/maintenance.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const maintenanceRouter = express.Router();

maintenanceRouter.use(authMiddleware);

maintenanceRouter.post('/maintenance',     createIssue);
maintenanceRouter.get('/maintenance',      getIssues);
maintenanceRouter.get('/maintenance/:id',  getIssueById);
maintenanceRouter.put('/maintenance/:id',  updateIssue);
maintenanceRouter.delete('/maintenance/:id', deleteIssue);

export default maintenanceRouter;

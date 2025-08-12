import { Router } from 'express';
import { getActiveTemplates } from './templates.controller';
const router = Router();
router.get('/', getActiveTemplates);
export default router;
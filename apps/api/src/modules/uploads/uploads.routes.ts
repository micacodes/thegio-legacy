// path: apps/api/src/modules/uploads/uploads.routes.ts
import { Router } from 'express';
import { premiumFilesUpload, upload } from './uploads.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// This route will accept two files: 'storyFile' and 'photoZip'
router.post(
  '/premium-files', 
  authMiddleware, 
  upload.fields([{ name: 'storyFile', maxCount: 1 }, { name: 'photoZip', maxCount: 1 }]), 
  premiumFilesUpload
);

export default router;
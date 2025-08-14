// path: apps/api/src/modules/uploads/uploads.controller.ts
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// --- Multer Configuration ---
// This tells multer where to save the files and what to name them
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });
// --- End Multer Configuration ---


// This is our new controller function
export const premiumFilesUpload = (req: Request, res: Response) => {
  // Multer processes the files and attaches them to the `req` object
  if (!req.files) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  // The 'files' object is typed with a workaround for Multer's default typing
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const storyFile = files['storyFile'] ? files['storyFile'][0] : null;
  const photoZip = files['photoZip'] ? files['photoZip'][0] : null;

  if (!storyFile || !photoZip) {
    return res.status(400).json({ message: 'Both story and photo files are required.' });
  }

  // Instead of S3 URLs, we now return the local path to the files
  res.status(200).json({
    storyFileUrl: `/uploads/${storyFile.filename}`,
    photoZipUrl: `/uploads/${photoZip.filename}`
  });
};
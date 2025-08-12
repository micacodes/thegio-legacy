import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getActiveTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.template.findMany({ where: { isActive: true } });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
};
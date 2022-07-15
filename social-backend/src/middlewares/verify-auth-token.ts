import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization as string;
    if (!token) throw new Error('Access Denied, Invalid Token');
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export default verifyAuthToken;

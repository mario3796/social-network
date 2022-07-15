import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { User } from '../models/user.model';

dotenv.config();

interface JWTPayload {
  user: User;
}

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization as string;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);
    const user = (decodedToken as JWTPayload).user;
    if (user.userType !== 'admin') {
      throw new Error('Not Authorized');
    }
    next();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export default isAdmin;

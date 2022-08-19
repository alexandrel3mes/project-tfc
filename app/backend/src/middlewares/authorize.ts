import 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import throwCustomError from '../utils/throwCustomError';

const secret = 'seusecretdetoken';

const authorize = (
  req: Request,
  _: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization;
  if (!token) {
    return throwCustomError('unauthorizedError', 'Token not found');
  }
  try {
    const decoded = verify(token, process.env.JWT_SECRET || secret);
    req.body.user = decoded;
    return next();
  } catch (e) {
    return throwCustomError('unauthorizedError', 'Invalid token');
  }
};

export default authorize;

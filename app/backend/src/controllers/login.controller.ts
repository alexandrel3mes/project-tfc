import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import throwCustomError from '../utils/throwCustomError';
import LoginService from '../services/login.service';

export default class LoginController {
  public login = async (req: Request, res: Response) => {
    const user = req.body;

    const result = await LoginService.login(user);
    res.status(StatusCodes.OK).json({ token: result });
  };

  public getRole = async (req: Request, res: Response) => {
    const { authorization } = req.headers;

    if (authorization === null) {
      throwCustomError('unauthorizedError', 'Token not found');
    }
    if (typeof authorization === 'string') {
      const result = await LoginService.getRole(authorization);
      res.status(StatusCodes.OK).json({ role: result });
    }
  };
}

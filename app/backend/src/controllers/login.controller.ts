import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LoginService from '../services/login.service';

export default class LoginController {
  public login = async (req: Request, res: Response) => {
    const user = req.body;

    const result = await LoginService.login(user);
    res.status(StatusCodes.OK).json({ token: result });
  };

  public getRole = async (req: Request, res: Response) => {
    const { user } = req.body;
    const result = await LoginService.getRole(user);
    res.status(StatusCodes.OK).json({ role: result });
  };
}

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TeamService from '../services/teams.service';

export default class TeamsController {
  public getAll = async (_req: Request, res: Response) => {
    const result = await TeamService.getAll();
    res.status(StatusCodes.OK).json(result);
  };
}

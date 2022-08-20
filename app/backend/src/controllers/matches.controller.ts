import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchesService from '../services/matches.service';

export default class MatchesController {
  public getAll = async (_req: Request, res: Response) => {
    const result = await MatchesService.getAll();
    res.status(StatusCodes.OK).json(result);
  };

/*   public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TeamService.getById(Number(id));
    res.status(StatusCodes.OK).json(result);
  }; */
}

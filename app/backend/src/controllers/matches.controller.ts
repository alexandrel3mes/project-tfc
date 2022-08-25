import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchesService from '../services/matches.service';

export default class MatchesController {
  public getAll = async (req: Request, res: Response) => {
    const { inProgress } = req.query;
    if (inProgress === undefined) {
      const result = await MatchesService.getAll();
      res.status(StatusCodes.OK).json(result);
    }
    if (inProgress !== undefined) {
      const result = await MatchesService.getAllInProgressOrNot(inProgress.toString());
      res.status(StatusCodes.OK).json(result);
    }
  };

  public create = async (req: Request, res: Response) => {
    const match = req.body;
    const result = await MatchesService.create(match);
    res.status(StatusCodes.CREATED).json(result);
  };

  public finish = async (req: Request, res: Response) => {
    const { id } = req.params;
    await MatchesService.finish(Number(id));
    res.status(StatusCodes.OK).json({ message: 'Finished!' });
  };

  public updateGoals = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    await MatchesService.updateGoals(Number(id), homeTeamGoals, awayTeamGoals);
    res.status(StatusCodes.OK).json({ message: 'Goals updated!' });
  };
}

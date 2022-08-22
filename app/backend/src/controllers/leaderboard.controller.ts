import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LeaderboardService from '../services/leaderboard.service';

export default class LeaderboardController {
  public getAllHomeTeams = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.getAllHomeGames();
    res.status(StatusCodes.OK).json(result);
  };
}

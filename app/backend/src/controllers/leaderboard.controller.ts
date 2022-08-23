import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LeaderboardService from '../services/leaderboard.service';

export default class LeaderboardController {
  public getAllHomeGames = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.getAllHomeGames();
    res.status(StatusCodes.OK).json(result);
  };

  public getAllAwayGames = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.getAllAwayGames();
    res.status(StatusCodes.OK).json(result);
  };

  public getAllGamesOverall = async (_req: Request, res: Response) => {
    const result = await LeaderboardService.getAllGamesOverAll();
    res.status(StatusCodes.OK).json(result);
  };
}

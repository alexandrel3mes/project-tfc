import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = Router();
const controller = new LeaderboardController();

router.get('/', controller.getAllGamesOverall);
router.get('/home', controller.getAllHomeGames);
router.get('/away', controller.getAllAwayGames);

export default router;

import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = Router();
const controller = new LeaderboardController();

router.get('/home', controller.getAllHomeTeams);
router.get('/away', controller.getAllAwayTeams);

export default router;

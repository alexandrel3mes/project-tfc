import { Router } from 'express';
import MatchesController from '../controllers/matches.controller';

const router = Router();
const controller = new MatchesController();

router.get('/', controller.getAll);

export default router;

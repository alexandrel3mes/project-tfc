import { Router } from 'express';
import authorize from '../middlewares/authorize';
import MatchesController from '../controllers/matches.controller';

const router = Router();
const controller = new MatchesController();

router.get('/', controller.getAll);
router.post('/', authorize, controller.create);
router.patch('/:id/finish', controller.finish);

export default router;

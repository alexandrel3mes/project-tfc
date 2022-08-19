import { Router } from 'express';
import LoginController from '../controllers/login.controller';
import authorize from '../middlewares/authorize';

const router = Router();
const controller = new LoginController();

router.get('/validate', authorize, controller.getRole);
router.post('/', controller.login);

export default router;

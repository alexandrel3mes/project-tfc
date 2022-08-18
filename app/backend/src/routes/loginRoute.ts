import { Router } from 'express';
import LoginController from '../controllers/login.controller';

const router = Router();
const controller = new LoginController();

router.post('/', controller.login);

export default router;

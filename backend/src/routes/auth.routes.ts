import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);
router.get('/me', requireAuth, AuthController.me);
router.post('/logout', AuthController.logout);

export default router;

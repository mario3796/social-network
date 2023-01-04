import { Router } from 'express';
import userController from '../controllers/user.controller';
import verifyAuthToken from '../middlewares/verify-auth-token';

const router = Router();

router.use(verifyAuthToken);

router.get('/profile/:userId', userController.getProfile);

router.get('/requests', userController.getRequests);

router.put('/requests', userController.addRequest);

router.put('/requests/:userId', userController.cancelRequest);

router.post('/requests/:userId', userController.acceptRequest);

router.get('/friends', userController.getFriends);

router.put('/friends', userController.deleteFriend);

router.get('/users', userController.getUsers);

export default router;

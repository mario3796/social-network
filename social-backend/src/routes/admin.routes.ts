import { Router } from 'express';

import adminController from '../controllers/admin.controller';
import isAdmin from '../middlewares/is-admin';

const router = Router();

router.use(isAdmin);

router.get('/users', adminController.getUsers);

router.get('/users/:userId', adminController.getUser);

router.delete('/users/:userId', adminController.deleteUser);

router.get('/requests', adminController.getRequests);

router.put('/requests/:requestId', adminController.acceptRequest);

router.delete('/requests/:requestId', adminController.rejectRequest);

export default router;

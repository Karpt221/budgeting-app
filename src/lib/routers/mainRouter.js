import { Router } from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import acountsRouter from './accountsRouter.js';
import transactionsRouter from './transactionsRouter.js';
import categoriesRouter from './budgetRouters/categoriesRouter.js';
import reportsRouter from './reportsRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/:user_id/', userRouter); 
router.use('/:user_id/reports', reportsRouter); 
router.use('/:user_id/accounts', acountsRouter);
router.use('/:user_id/transactions', transactionsRouter);
router.use('/:user_id/categories', categoriesRouter);


export default router;

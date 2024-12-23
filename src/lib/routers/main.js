import { Router } from 'express';  
import authRouter from './auth.js';  
import acountsRouter from './accounts.js';  
import transactionsRouter from './transactions.js';  

const router = Router();  

router.use('/auth', authRouter);  
router.use('/:user_id/accounts', acountsRouter); 
router.use('/:user_id/transactions', transactionsRouter); 

export default router;
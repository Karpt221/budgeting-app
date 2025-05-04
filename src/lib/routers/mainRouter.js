import { Router } from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import acountsRouter from './accountsRouter.js';
import transactionsRouter from './transactionsRouter.js';
import categoriesRouter from './budgetRouters/categoriesRouter.js';
import reportsRouter from './reportsRouter.js';
import {
  createBankingAccount,
} from '../db/accountsQueries.js';

const router = Router();

router.get('/test', (req, res, next) => {
  try {
    return res.status(200).json("Hello Worls!");
  } catch (error) {
    next(error);
  }
});
router.post('/test/:user_id',   async (req, res, next) => {
    try {
      const { name, balance } = req.body;
      const { user_id } = req.params;
      const account = await createBankingAccount(user_id, name, balance);
      res.status(201).json({
        account,
      });
    } catch (err) {
      if (
        err.message.includes(
          'duplicate key value violates unique constraint "unique_user_account_name"',
        )
      ) {
        res
          .status(409)
          .json({
            code: 409,
            message: 'Account with this name already exist!',
          });
      } else {
        next(err);
      }
    }
  },);
router.use('/auth', authRouter);
router.use('/:user_id/', userRouter); 
router.use('/:user_id/reports', reportsRouter); 
router.use('/:user_id/accounts', acountsRouter);
router.use('/:user_id/transactions', transactionsRouter);
router.use('/:user_id/categories', categoriesRouter);


export default router;

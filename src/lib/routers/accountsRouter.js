import { Router } from 'express';
import passport from '../middlewares/passport.js';

import {
  getAccountsByUserId,
  createBankingAccount,
  deleteBankingAccountById,
  updateBankingAccountById,
} from '../db/accountsQueries.js';

const router = Router({ mergeParams: true });

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user_id } = req.params;
    const accounts = await getAccountsByUserId(user_id);
    res.json({
      accounts: accounts,
    });
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { name, balance } = req.body;
      const { user_id } = req.params;
      const account = await createBankingAccount(user_id, name, balance);
      res.status(201).json({
        account,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/:account_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { account_id } = req.params;
      const deletedAccount = await deleteBankingAccountById(account_id);
      res.status(200).json({
        message: 'Banking account was deleted successfully!',
        deletedAccount,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:account_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { account_id } = req.params;
      const { name } = req.body;
      const updatedAccount = await updateBankingAccountById(account_id, name);
      res.status(200).json({
        message: 'Banking account was updated successfully!',
        updatedAccount,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;

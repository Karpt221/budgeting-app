import { Router } from 'express';
import passport from '../middlewares/passport.js';

import {
  getTransactionsByUserId,
  getTransactionsByAccountId,
  createTransaction,
  deleteTransactionById,
  updateTransactionById,
} from '../db/transactionQueries.js';

const router = Router({ mergeParams: true });

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user_id } = req.params;
    const transactions = await getTransactionsByUserId(user_id);
    res.json({
      message: 'All user transaction was transferred successfully!',
      transactions: transactions,
    });
  },
);

router.get(
  '/:account_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { account_id } = req.params;
    const transactions = await getTransactionsByAccountId(account_id);
    res.json({
      message: 'Transactions of specific account was transferred successfully!',
      transactions: transactions,
    });
  },
);
router.post(
  '/:account_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { account_id } = req.params;
      const { date, payee, category, memo, amount, cleared } = req.body;

      if (!date || !payee || !category || !amount || cleared === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newTransaction = await createTransaction({
        account_id,
        date,
        payee,
        category,
        memo,
        amount,
        cleared,
      });

      res.status(201).json({
        status: 201,
        message: 'Transaction was added successfully!',
        transaction: newTransaction,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/:transaction_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { transaction_id } = req.params;

      const deletedTransaction = await deleteTransactionById(transaction_id);

      res.status(200).json({
        status: 200,
        message: 'Transaction was deleted successfully!',
        transaction: deletedTransaction,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:transaction_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { transaction_id } = req.params;
      const updates = req.body;

      const updatedTransaction = await updateTransactionById(
        transaction_id,
        updates,
      );

      res.status(200).json({
        status: 200,
        message: 'Transaction was updated successfully!',
        transaction: updatedTransaction,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;

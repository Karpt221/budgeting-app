import { Router } from 'express';
import passport from '../middlewares/passport.js';

import {
  getTransactionsByUserId,
  getTransactionsByAccountId,
  createTransaction,
  deleteTransactionsByIds,
  updateTransactionById,
} from '../db/transactionQueries.js';

const router = Router({ mergeParams: true });

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user_id } = req.params;
    console.log('getTransactionsByUserId: ',user_id);
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
      const { transaction_date, payee, category, memo, amount } = req.body;
      console.log(transaction_date, payee, category, memo, amount);
      console.log(req.body);
      console.log(req.params);
      if (!transaction_date || !payee || !category || !amount) {
        return res
          .status(400)
          .json({ code: 400, message: 'Missing required fields' });
      }

      const newTransaction = await createTransaction({
        account_id,
        transaction_date,
        payee,
        category,
        memo,
        amount,
      });

      res.status(201).json({
        message: 'Transaction was added successfully!',
        transaction: newTransaction,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      // const { transaction_ids } = req.params;
      const { transaction_ids } = req.body;
      console.log(transaction_ids);
      if (!Array.isArray(transaction_ids) || transaction_ids.length === 0) {
        return res.status(400).json({
          message: 'Invalid request: transaction_ids must be a non-empty array.',
        });
      }
      const deletedTransactions = await deleteTransactionsByIds(transaction_ids);
      res.status(200).json({
        message: 'Transactions was deleted successfully!',
        transactions: deletedTransactions,
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
      console.log('put endpoint:',transaction_id);
      const updatedTransaction = await updateTransactionById(
        transaction_id,
        updates,
      );

      res.status(200).json({
        message: 'Transaction was updated successfully!',
        transaction: updatedTransaction,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;

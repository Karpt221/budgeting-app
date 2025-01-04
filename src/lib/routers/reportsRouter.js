import { Router } from 'express';
import passport from '../middlewares/passport.js';

import {
  getUserSpendingsByCategory,
  getUserSpendingStats,
  getUserSpendingsByCategoriesForAccounts,
} from '../db/reportsQueries.js';

const router = Router();

router.post(
  '/spending-breakdown',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const filters = req.body;
      const spendingsByCategories = await getUserSpendingsByCategory(filters);
      const spendingStats = await getUserSpendingStats(filters);

      const transformedSpendings = spendingsByCategories.map((category) => {
        return {
          x: `${category.category_name}\n${category.total_spending} $\n${category.percent}%`,
          y: Number.parseInt(category.percent),
          color: category.category_color,
          category_name: category.category_name,
          amount: category.total_spending,
          percent: category.percent,
        };
      });

      res.json({
        message: 'Spendings fetched!',
        spendingsBreakdown: {
          spendingsByCategories: transformedSpendings,
          spendingStats,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching spendings', error });
    }
  },
);

router.post(
  '/spending-trends',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const filters = req.body;
      console.log('filters:', filters);
      if ((filters.categories.length === 1 && filters.categories[0] === '') || (filters.accounts.length === 1 && filters.accounts[0] === '')) {
        res.json({
          message: 'Spending trends fetched!',
          spendinTrends: {
            spendingsBreakdownByMonth: [],
            totalSpending: 0,
            averageMonthlySpending: 0,
          },
        });
      } else {
        const {
          spendingsBreakdownByMonth,
          totalSpending,
          averageMonthlySpending,
        } = await getUserSpendingsByCategoriesForAccounts(filters);

        res.json({
          message: 'Spending trends fetched!',
          spendinTrends: {
            spendingsBreakdownByMonth,
            totalSpending,
            averageMonthlySpending,
          },
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching spendings', error });
    }
  },
);

export default router;

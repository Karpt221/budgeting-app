import { Router } from 'express';
import passport from '../middlewares/passport.js';

import {
  getUserSpendingsByCategory,
  getUserSpendingStats,
} from '../db/reportsQueries.js';

const router = Router();
// const getRandomColor = () => {
//   const randomColor = Math.floor(Math.random() * 16777215).toString(16);
//   return `#${randomColor.padStart(6, '0')}`; // Ensure it's always 6 digits
// };

router.post(
  '/spending-breakdown',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const filters = req.body;
      const spendingsByCategories = await getUserSpendingsByCategory(filters);
      const spendingStats = await getUserSpendingStats(filters);
      if (!spendingsByCategories) {
        return res.status(404).json({ message: 'No spendings found.' });
      }

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

export default router;

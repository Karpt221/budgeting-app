import { Router } from 'express';
import passport from 'passport';
import {
  getTargetByCategoryId,
  createTarget,
  updateTarget,
  deleteTarget,
} from '../../db/budgetQueries/categoryTargetQueries.js';

const targetsRouter = Router({ mergeParams: true });

targetsRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const target = await getTargetByCategoryId(category_id);
      if (target) {
        res.json({
          message: 'Fetched target successfully',
          target,
        });
      } else {
        res.status(404).json({ error: 'Target not found' });
      }
    } catch (err) {
      next(err);
    }
  },
);

targetsRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const { targetType, need, targetDate, nextGoal } = req.body;
      const newTarget = await createTarget(
        category_id,
        targetType,
        need,
        targetDate,
        nextGoal,
      );
      res.status(201).json({
        message: 'Target created successfully',
        target: newTarget,
      });
    } catch (err) {
      next(err);
    }
  },
);

targetsRouter.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const { targetType, need, targetDate, nextGoal } = req.body;
      const updatedTarget = await updateTarget(
        category_id,
        targetType,
        need,
        targetDate,
        nextGoal,
      );
      res.json({
        message: 'Target updated successfully',
        target: updatedTarget,
      });
    } catch (err) {
      next(err);
    }
  },
);

targetsRouter.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const deletedTarget = await deleteTarget(category_id);
      res.status(200).json({
        message: 'Category was deleted successfully!',
        deletedTarget,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default targetsRouter;

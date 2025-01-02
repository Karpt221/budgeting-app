import { Router } from 'express';
import passport from 'passport';
import {
  getCategoriesByUserId,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../db/budgetQueries/categoriesQueries.js';
import targetsRouter from './categoryTargetRouter.js';

const categoriesRouter = Router({ mergeParams: true });

categoriesRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const categories = await getCategoriesByUserId(user_id);
      console.log(categories);
      res.json({
        message: 'Fetched categories successfully',
        categories,
      });
    } catch (err) {
      next(err);
    }
  },
);

categoriesRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const newCategory = await createCategory(name);
      res.status(201).json({
        message: 'Category created successfully',
        category: newCategory,
      });
    } catch (err) {
      next(err);
    }
  },
);

categoriesRouter.put(
  '/:category_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const { name, assigned } = req.body;
      const updatedCategory = await updateCategory(category_id, name, assigned);
      res.json({
        message: 'Category updated successfully',
        category: updatedCategory,
      });
    } catch (err) {
      next(err);
    }
  },
);

categoriesRouter.put(
  '/:category_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const { name, assigned } = req.body;
      const updatedCategory = await updateCategory(category_id, name, assigned);
      res.json({
        message: 'Category updated successfully',
        category: updatedCategory,
      });
    } catch (err) {
      next(err);
    }
  },
);

categoriesRouter.delete(
  '/:category_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_id } = req.params;
      const deletedCategory = await deleteCategory(category_id);
      res.status(200).json({
        message: 'Category was deleted successfully!',
        deletedCategory,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Use targetsRouter for nested routes
categoriesRouter.use('/:category_id/target', targetsRouter);

export default categoriesRouter;

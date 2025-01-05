import { Router } from 'express';
import passport from 'passport';
import {
  getCategoriesByUserId,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategories,
  getReadyToAssign,
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

categoriesRouter.get(
  '/ready-to-assign',
  //passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const ready_to_assign = Number.parseInt(await getReadyToAssign(user_id));
      console.log(ready_to_assign);
      res.json({
        message: 'Fetched ready_to_assign successfully',
        ready_to_assign: ready_to_assign,
      });
    } catch (err) {
      next(err);
    }
  },
);

categoriesRouter.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { user_id } = req.params;
      const categories = await getAllCategories(user_id);
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
      const { user_id, category_name } = req.body;
      const newCategory = await createCategory(user_id, category_name);
      res.status(201).json({
        message: 'Category created successfully',
        category: newCategory,
      });
    } catch (err) {
      if (
        err.message.includes(
          'duplicate key value violates unique constraint "unique_user_category"',
        )
      ) {
        res.status(409).json({
          code: 409,
          message: 'Category with this name already exist!',
        });
      } else {
        next(err);
      }
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
      if (
        err.message.includes(
          'duplicate key value violates unique constraint "unique_user_category"',
        )
      ) {
        res.status(409).json({
          code: 409,
          message: 'Category with this name already exist!',
        });
      } else {
        next(err);
      }
    }
  },
);

// categoriesRouter.put(
//   '/:category_id',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {
//     try {
//       const { category_id } = req.params;
//       const { name, assigned } = req.body;
//       const updatedCategory = await updateCategory(category_id, name, assigned);
//       res.json({
//         message: 'Category updated successfully',
//         category: updatedCategory,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },
// );

categoriesRouter.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { category_ids } = req.body;
      console.log('req.body', req.body);
      console.log('category_ids', category_ids);
      if (!Array.isArray(category_ids) || category_ids.length === 0) {
        return res.status(400).json({
          message: 'Invalid request: category_ids must be a non-empty array.',
        });
      }
      const deletedCategories = await deleteCategories(category_ids);
      res.status(200).json({
        message: 'Categories was deleted successfully!',
        deletedCategories,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Use targetsRouter for nested routes
categoriesRouter.use('/:category_id/target', targetsRouter);

export default categoriesRouter;

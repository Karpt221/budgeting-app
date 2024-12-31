import { Router } from 'express';
import { findUserById } from "../db/userQueries.js";
import passport from '../middlewares/passport.js';

const router = Router({ mergeParams: true });

router.get('/',
   passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {  
    try {  
      const user_id = req.params.user_id;  
      console.log('userRouter: ',req.params);
      const user = await findUserById(user_id);
  
      if (!user) {  
        return res.status(404).json({ message: 'User not found' });  
      }  
  
      res.status(200).json(user);  
    } catch (error) {  
      next(error);  
    }  
  });  
  
  export default router;  
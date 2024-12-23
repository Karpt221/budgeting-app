import { Router } from 'express';  
import acountsRouter from './accounts.js';  

const router = Router();  

router.use('/:user_id', acountsRouter); 

export default router;
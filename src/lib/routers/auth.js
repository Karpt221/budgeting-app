import { Router } from 'express';  
import bcrypt from 'bcryptjs';  
import jwt from 'jsonwebtoken';  
import { createUser, findUserByEmail } from '../db/userQueries.js';  

const router = Router();  
const JWT_SECRET = 'secret';  

router.post('/sign-up', async (req, res, next) => {  
  try {  
    const hashedPassword = await bcrypt.hash(req.body.password, 10);  
    await createUser(req.body.email, hashedPassword);  
    res.status(201).json({ status: 201, message: 'Account was created successfully!' });  
  } catch (err) {  
    next(err);  
  }  
});  

router.post('/sign-in', async (req, res,next) => {  
  const { email, password } = req.body;  
  console.log(email, password);
  try {  
    const user = await findUserByEmail(email);  

    if (!user) {  
      return res.status(401).json({ message: 'Incorrect username or password' });  
    }  

    const match = await bcrypt.compare(password, user.password_hash);  
    if (!match) {  
      return res.status(401).json({ message: 'Incorrect username or password' });  
    }  

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });  

    res.json({ token });  
  } catch (err) {  
    next(err);  
  }  
});  

export default router;
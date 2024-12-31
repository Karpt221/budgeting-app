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
    return res
      .status(201)
      .json({ message: 'Account was created successfully!' });
  } catch (err) {

    return res
      .status(401)
      .json({code: 401, message: 'Account with this email already exist!'});
  }
});

router.get('/:token', (req, res, next) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    return res.status(200).json(decoded);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({code: 401, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ code: 403, message: 'Token has expired' });
    }
    next(error);
  }
});

router.post('/sign-in', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({code: 401, message: 'Incorrect email' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({code: 401, message: 'Incorrect password' });
    }
    console.log(user);
    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });
    console.log(token);
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
});

export default router;

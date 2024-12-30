import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';  
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';  
import { findUserById } from '../db/userQueries.js';  

passport.use(  
  new JwtStrategy(  
    {  
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  
      secretOrKey: process.env.JWT_SECRET,  
    },  
    async (jwtPayload, done) => {  
      try {  
        const user = await findUserById(jwtPayload.id);  
        if (!user) {  
          return done(null, false, { message: 'User not found' });  
        }  
        return done(null, user);  
      } catch (err) {  
        return done(err, false);  
      }  
    },  
  ),  
);  

export default passport;
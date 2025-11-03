import passportGoogle from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { User } from '../../models/User.js';

dotenv.config();

const GoogleStrategy = passportGoogle.Strategy;

export function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || '';
          if (!email || !email.endsWith('@gmail.com')) {
            return done(null, false, { message: 'Only Gmail accounts are allowed' });
          }

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              email,
              name: profile.displayName || email.split('@')[0],
              pictureUrl: profile.photos?.[0]?.value,
              provider: 'google'
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user._id.toString(), email: user.email, isSuperAdmin: user.isSuperAdmin });
  });

  passport.deserializeUser(async (payload, done) => {
    try {
      const user = await User.findById(payload.id).lean();
      if (!user) return done(null, false);
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  });
}



import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';

import { configurePassport } from './modules/auth/passport.js';
import authRouter from './routes/auth.routes.js';
import familyRouter from './routes/family.routes.js';
import memberRouter from './routes/member.routes.js';
// import paymentRouter from './routes/payment.routes.js';
import userRouter from './routes/user.routes.js';

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apna_parivar';


dotenv.config();

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  })
);
app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120
  })
);

configurePassport(passport);
app.use(
  session({
    secret: process.env.JWT_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax'
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/apna_parivar' })
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'apna-parivar', version: '0.1.0' });
});

app.use('/api/auth', authRouter);
app.use('/api/families', familyRouter);
app.use('/api/members', memberRouter);
// app.use('/api/payments', paymentRouter);
app.use('/api/users', userRouter);




app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});
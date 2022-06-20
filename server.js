import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';
import morgan from 'morgan';

import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleImagePost, handleApiCall } from './controllers/image.js';
import { handleGetProfile } from './controllers/profile.js';

const PORT = process.env.PORT || 3001;
// This is not production safe. Used only due to heroku free plan.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI,
});

const app = express();
const whitelist = ['http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(express.json());

const saltRounds = 10;
app.get('/', (req, res) => {
  res.status(200).send('It is working');
});
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) =>
  handleRegister(req, res, db, bcrypt, saltRounds)
);
app.get('/profile/:userId', (req, res) => handleGetProfile(req, res, db));
app.put('/image', (req, res) => handleImagePost(req, res, db));
app.post('/imageurl', (req, res) => handleApiCall(req, res));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleImagePost, handleApiCall } from './controllers/image.js';
import { handleGetProfile } from './controllers/profile.js';

const PORT = process.env.PORT || 3001;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();
app.use(cors());
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

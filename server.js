import express from 'express';
import bodyParser from 'body-parser';
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
    host: '127.0.0.1',
    user: 'tp',
    password: '',
    database: 'ztm-smart-brain',
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

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

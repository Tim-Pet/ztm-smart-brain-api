import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

import register from './controllers/register.js';
import signin from './controllers/signin.js';
import image from './controllers/image.js';
import profile from './controllers/profile.js';

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

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) =>
  register.handleRegister(req, res, db, bcrypt, saltRounds)
);

app.get('/profile/:userId', (req, res) =>
  profile.handleGetProfile(req, res, db)
);

app.put('/image', (req, res) => image.handleImagePost(req, res, db));

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

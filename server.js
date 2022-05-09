import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'tim',
    password: '',
    database: 'ztm-smart-brain',
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '0',
      name: 'example',
      email: 'example@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date(),
    },
  ],
};

const saltRounds = 10;

app.get('/', (req, res) => {
  res.json('You accessed the root route');
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = database.users.find((user) => user.email === email);
  if (!user) return res.status(404).json('error logging in. User not found');

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) return res.status(200).json(user);
    return res.status(400).json('error logging in. Password incorrect');
  });
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  const user = database.users.find(
    (user) => user.email === email || user.name === name
  );
  if (user) return res.status(400).json('email or name already exists');

  bcrypt.hash(password, saltRounds, (err, hash) => {
    const newUser = {
      id: database.users.length + 1,
      name,
      email,
      password: hash,
      entries: 0,
      joined: new Date(),
    };

    database.users.push(newUser);

    res.status(200).json(newUser);
  });
});

app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const user = database.users.find((user) => user.id === userId);
  if (user) return res.status(200).json(user);
  res.status(404).json('user not found');
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.find((user) => user.id === id);
  if (user) {
    user.entries++;
    return res.status(200).json(user.entries);
  }
  res.status(404).json('user not found');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

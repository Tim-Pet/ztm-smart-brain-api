const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
  users: [
    {
      id: '1',
      name: 'John',
      email: 'john@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '2',
      name: 'Jane',
      email: 'jane@gmail.com',
      password: 'password',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.json('this is working');
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = database.users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) return res.status(200).json(user);
  res.status(404).json('error logging in. User not found');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const user = database.users.find(
    (user) => user.email === email || user.name === name
  );
  if (user) return res.status(400).json('email or name already exists');

  const newUser = {
    id: database.users.length + 1,
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  };

  database.users.push(newUser);

  res.status(200).json(newUser);
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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

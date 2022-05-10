import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

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

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((user) => {
      bcrypt.compare(password, user[0].hash).then((result) => {
        if (result) {
          return db
            .select('*')
            .from('users')
            .where('email', '=', email)
            .then((user) => {
              res.status(200).json(user[0]);
            })
            .catch((err) =>
              res.status(404).json('error logging in. User not found')
            );
        } else {
          res.status(404).json('wrong credentials');
        }
      });
    })
    .catch((err) => {
      res.status(404).json('wrong credentials');
    });
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);

  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name,
            joined: new Date(),
          })
          .then((user) => {
            res.status(200).json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => {
        res.status(400).json('error registering user');
      });
  });
});

app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  db.select('*')
    .from('users')
    .where({ id: userId })
    .then((user) => {
      if (user.length) {
        res.status(200).json(user[0]);
      } else {
        res.status(404).json('User not found');
      }
    })
    .catch((err) => {
      res.status(400).json('error getting user');
    });
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json('error getting user');
    });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

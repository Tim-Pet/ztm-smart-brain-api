const handleSignin = (req, res, db, bcrypt) => {
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
};

export { handleSignin };

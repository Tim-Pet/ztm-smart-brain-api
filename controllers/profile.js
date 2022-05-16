const handleGetProfile = (req, res, db) => {
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
};

export default handleGetProfile;

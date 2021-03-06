import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: `b6cd2b615d4c49e6b991dec3f7754ba1`,
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json('unable to work with API', err));
};

const handleImagePost = (req, res, db) => {
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
};

export { handleApiCall, handleImagePost };

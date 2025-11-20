const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use environment variable for production

// Models
const MovieSchema = new mongoose.Schema({
  episode: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  poster: { type: String, required: true },
  best_character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
});
const Movie = mongoose.model('Movie', MovieSchema);

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  affiliation: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true }
});
const Character = mongoose.model('Character', CharacterSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Comment = mongoose.model('Comment', CommentSchema);

const authenticateToken = (req, res, next) => {
  // this is fancy, i dont like oauth, its easier to jwt
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const data = require('./data.js');

app.get('/', (req, res) => {
  res.send('pinged the rooster backend!');
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/movies/seed', async (req, res) => {
  try {
    await Movie.deleteMany({});
    await Character.deleteMany({});

    for (const movieData of data) {
      const character = new Character(movieData.best_character);
      await character.save();

      const movie = new Movie({
        ...movieData,
        best_character: character._id
      });
      await movie.save();
    }

    res.status(201).json({ message: 'copied from startwarsapi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find().populate('best_character');
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.patch('/api/movies/:id/like', authenticateToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    movie.likes++;
    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/movies/:id/dislike', authenticateToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    movie.dislikes++;
    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/comments/:movieId', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const comment = new Comment({
      text,
      movie: movie._id,
      user: req.user.userId
    });
    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate('user', 'username');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/comments/:movieId', async (req, res) => {
  try {
    const comments = await Comment.find({ movie: req.params.movieId }).populate('user', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


mongoose.connect('mongodb://mongo:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));

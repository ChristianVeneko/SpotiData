import path from 'path';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { Login, callback } from './routes/auth.routes.js';
import { spotifyApi } from './config.js';

const app = express();

app.use(session({
  secret: 'yolavienuntaxi',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());
app.use(morgan('dev'));

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/api/session', (req, res) => {
  res.json(req.session);
});

app.get('/login', Login);
app.get('/callback', callback);

// Nuevas rutas de la API
app.get('/api/me', async (req, res) => {
  try {
    const me = await spotifyApi.getMe();
    res.json(me.body);
  } catch (err) {
    res.status(err.statusCode).json({ error: err.message });
  }
});

app.get('/api/top-artists', async (req, res) => {
  try {
    const topArtists = await spotifyApi.getMyTopArtists();
    res.json(topArtists.body);
  } catch (err) {
    res.status(err.statusCode).json({ error: err.message });
  }
});

app.get('/api/top-tracks', async (req, res) => {
  try {
    const topTracks = await spotifyApi.getMyTopTracks();
    res.json(topTracks.body);
  } catch (err) {
    res.status(err.statusCode).json({ error: err.message });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;
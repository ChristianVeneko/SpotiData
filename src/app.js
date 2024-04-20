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

app.get('/api/token', (req, res) => {
  if (req.session.access_token) {
    res.json({ access_token: req.session.access_token });
  } else {
    res.status(401).json({ error: 'No hay un token de acceso válido' });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;
import express from 'express';
import session from 'express-session';
import { Login, callback, refresh } from './routes/auth.routes.js';
import cors from 'cors';
import dotenv from 'dotenv'


const app = express();
app.use(cors({
  origin: ['https://spotidata.vercel.app', 'http://localhost:3000'], // Agrega más orígenes si es necesario
  credentials: true
}));

app.use(session({
  secret: 'yolavienuntaxi',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json());

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/api/session', (req, res) => {
  res.json(req.session);
});

app.get('/login', Login);
app.get('/refresh', refresh);
app.get('/callback', callback);

const requireAuth = (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json({ error: 'No hay un token de acceso válido' });
  }
  next();
};

app.get('/api/token', requireAuth, (req, res) => {
  res.json({ access_token: req.session.access_token, refresh_token: req.session.refresh_token });
});

app.get('/api/hello', (req, res) => {
  res.json('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa')
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;
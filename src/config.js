import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv'
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const SECRET_CLIENT = process.env.SECRET_CLIENT;

export const scopes = [
  'user-read-email',
  'streaming',
  'user-read-private',
  'user-library-read',
  "user-top-read"]


export const spotifyApi = new SpotifyWebApi({
  clientId: CLIENT_ID,
  clientSecret: SECRET_CLIENT,
  redirectUri: 'http://localhost:3000/callback'
});
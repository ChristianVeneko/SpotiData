import { spotifyApi, scopes, AUTH_URL } from "../config.js";
import session from "express-session";

export const Login = (req, res) => {
  const authorizationUrl = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizationUrl);
};

export const callback = (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    console.error("Callback Error:", error);
    res.redirect("/login");
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];

      req.session.access_token = access_token;

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      // Redirigir al frontend con el token de acceso como parámetro de consulta
      res.redirect(`${AUTH_URL}/auth-callback?access_token=${access_token}`);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.redirect("/login");
    });
};

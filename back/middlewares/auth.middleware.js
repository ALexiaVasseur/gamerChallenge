import config from "../config.js";
import { UnauthorizedError } from "../lib/errors.js";
import { verifyJwtToken } from "../lib/tokens.js";


export const isAuthenticated = (req, res, next) => {
  const authorizationHeaders = req.headers?.["Authorization"] || req.headers?.["authorization"];
  const token = req.cookies?.["x-auth-token"] || authorizationHeaders?.split("Bearer ")[1];


  if (!token) {
    return res.status(401).json({ message: "Token manquant, veuillez vous connecter." });
  }

  const decoded = verifyJwtToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }

  req.userId = decoded.userId; // Ajouter l'ID utilisateur au `req` pour qu'il soit accessible dans la route
  next(); // Passer à la route suivante (la fonction du contrôleur)
};


export function authentify(req) {

  console.log("🔍 Headers :", req.headers);
  console.log("🔍 Cookies :", req.cookies);

  
  // Get access token from either cookies (browsers) or Authorization headers (any service)
  const authorizationHeaders = req.headers?.["Authorization"] || req.headers?.["authorization"];
  const accessToken = req.cookies?.["x-auth-token"] || authorizationHeaders?.split("Bearer ")[1];
  if (! accessToken) { throw new UnauthorizedError("No access token provided in request headers"); }

  // Verify token authenticity and validity
  const decodedToken = verifyJwtToken(accessToken);
  if (! decodedToken) { throw (new UnauthorizedError("Invalid or expired access token")); }
  
  // Optional CSRF validation
  if (config.auth.preventCSRF) {
    const csrfToken = req.headers?.["x-csrf-token"];
    if (! csrfToken) { throw new UnauthorizedError("No csrf token provided in request headers"); }

    if (decodedToken.csrfToken !== csrfToken) { throw new UnauthorizedError("Bad CSRF token provided"); }
  }

  // Return token payload
  return decodedToken;
}
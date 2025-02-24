import { Account, RefreshToken, Badge, Challenge, Receive, Participate } from "../models/index.js"; 
import { z } from "zod";
import { hash, compare, generateJwtToken, verifyJwtToken,unsaltedHash } from "../crypto.js";
import { NotFoundError, BadRequestError } from "../lib/errors.js"
import { generateAuthenticationTokens } from "../lib/tokens.js";
import { givePoint } from "../lib/voteGive.js";




export async function getOneUser(req, res) {
  const { id } = req.params;
  const idUser = parseInt(id);
  
  const user = await Account.findOne({
    where: { id: idUser },
    attributes: ['id', 'pseudo', 'email', 'score_global', 'description'],
    include: [
      {
        model: Receive,
        as: 'receivedBadges',
        include: [
          {
            model: Badge,
            as: 'badge',
            attributes: ['id', 'name', 'description', 'imageUrl']
          }
        ]
      },
      {
        model: Challenge,
        as: 'challenges',
        attributes: ['id', 'title', 'description', 'rules', 'type', 'image_url']
      },
      {
        model: Participate,
        as: 'participations',
        include: [
          {
            model: Challenge,
            as: 'challenge',
            attributes: ['id', 'title', 'description', 'rules', 'type', 'image_url']
          }
        ]
      },
    ]
  });

  if (!user) {
    throw new NotFoundError("Utilisateur non trouvé."); 
  }

  res.status(200).json({
    id: user.id,
    pseudo: user.pseudo,
    email: user.email,
    score_global: user.score_global,
    description: user.description,
    badges: user.receivedBadges.map(r => r.badge),
    challenges: user.challenges,
    participate: user.participations 
  });
}


const createUserBodySchema = z.object({
    email: z.string().email("L'email est invalide."), 
    pseudo: z.string().min(1, "Le pseudo est requis."),
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
    confirmPassword: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
    description: z.string().min(1, "Une description est requise."),
  });

// User registration
export async function signupUser(req, res) {
  const result = createUserBodySchema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError(result.error.format()); 
}

  const { pseudo, email, password, description } = result.data;
  const existingEmail = await Account.findOne({ where: { email } });
  if (existingEmail) {
    throw new BadRequestError("Cet email est déjà utilisé."); 
}

  const existingPseudo = await Account.findOne({ where: { pseudo } });
  if (existingPseudo) {
    throw new BadRequestError("C epseduo est déjà utilisé.");
}

  const hashedPassword = await hash(password);

  const newUser = await Account.create({
      pseudo,
      email,
      password: hashedPassword,
      description
  });

  const account = await Account.findOne ({where: {email}});
  if (!account) {
    throw new NotFoundError("Credentiales invalides."); 
}

  const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(account);

  await RefreshToken.destroy({ where: { userId: account.id } });
  await RefreshToken.create({
    userId: account.id,
    token: unsaltedHash(refreshToken.token),
    expiresAt: refreshToken.expiresAt
  });

  res.cookie("x-auth-token", accessToken.token, {
      maxAge: accessToken.expiresInMS,
      ...getCookieSecuritySettings()
  });

  res.cookie("x-auth-refresh-token", refreshToken.token, {
      maxAge: refreshToken.expiresInMS,
      path: "/api/auth/refresh",
      ...getCookieSecuritySettings()
  });

  res.status(201).json({
      message: "Utilisateur créé avec succès.",
      accessToken,
      refreshToken,
      ...(csrfToken && { csrfToken }),
      user: {
          id: account.id,
          pseudo: account.pseudo,
          email: account.email,
          description: newUser.description
      }
  });
}

// User login
export async function loginUser(req,res) {
  const Schema = z.object({
      email: z.string().email("L'email est invalide."),
      password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
  });

  const result = Schema.safeParse(req.body);
  if (!result.success) {
    throw new BadRequestError(result.error.format()); 
}

  const { email, password } = req.body;

  const account = await Account.findOne ({where: {email}});
  if (!account) {
    throw new NotFoundError("les credentials sont invalides."); 
}

  const validPassword = await compare(password, account.password);

  if (!validPassword) {
    throw new NotFoundError("les credentials sont invalides."); 
}

  const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(account);

  await RefreshToken.destroy({ where: { userId: account.id } });
  await RefreshToken.create({
    userId: account.id,
    token: unsaltedHash(refreshToken.token),
    expiresAt: refreshToken.expiresAt
  });

  res.cookie("x-auth-token", accessToken.token, {
      maxAge: accessToken.expiresInMS,
      ...getCookieSecuritySettings()
  });

  res.cookie("x-auth-refresh-token", refreshToken.token, {
      maxAge: refreshToken.expiresInMS,
      path: "/api/auth/refresh",
      ...getCookieSecuritySettings()
  });

  res.json({
      accessToken,
      refreshToken,
      ...(csrfToken && { csrfToken }),
      user: {
          id: account.id,
          pseudo: account.pseudo,
          email: account.email,
      }
  });
    
}

// User logout
export async function logoutUser(req,res) { 
    authorization.clearToken(res) ;
    res.redirect('/') ;
}

function getCookieSecuritySettings() {
  return {
    httpOnly: true, 
    secure: false,   
    sameSite: "Lax" 
  };
}
// Get Leaderboards
  export async function getLeaderboard(req, res) {
    const leaderboard = await Account.findAll({
      order: [['score_global', 'DESC']],
      limit: 50
    });

    if (!leaderboard || leaderboard.length === 0) {
      throw new NotFoundError("pas de leaderboard trouvé."); 
    }
    res.status(200).json(leaderboard);
  }

  export async function updateScore(req, res) {
    const { userId } = req.params;
    const { point } = req.body;

    const newScore = await givePoint(userId, point);

    if (newScore === null) {
      throw new BadRequestError("Echec de la mise à jour du score."); 
    }
    res.status(200).json({
      message: "Points ajoutés avec succès !",
      newScore
    });
  }

  export async function checkUser(req, res) {
    res.status(200).json({ message: "Token valide" });
}


// User update
export async function updateUser(req, res) {
  const { userId } = req.params;
  const { pseudo, email, description } = req.body; 

  if (!pseudo || !email || !description) {
    throw new BadRequestError("Tous les champs sont requis."); 
  }

  const user = await Account.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("utilisateur non trouvé."); 
  }

  user.pseudo = pseudo;
  user.email = email;
  user.description = description;

  await user.save();

  res.status(200).json({
    message: "Utilisateur mis à jour avec succès.",
    user: {
      id: user.id,
      pseudo: user.pseudo,
      email: user.email,
      description: user.description
    }
  });
}

// User delete
export async function deleteUser(req, res) {
  const { userId } = req.params;

  const user = await Account.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("Utilisateur non trouvé."); 
  }

  user.pseudo = `Utilisateur supprimé-${user.id}`;
  user.email = `deleted-user-${user.id}@example.com`;
  user.description = "Compte supprimé";
  user.password = await hash("deleted");

  await user.save();

  res.status(200).json({ message: "Compte supprimé (anonymisé) avec succès." });
}


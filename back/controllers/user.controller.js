import { Account, RefreshToken, Badge, Challenge, Receive, Participate } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken,unsaltedHash } from "../crypto.js";
import { generateAuthenticationTokens } from "../lib/tokens.js";
import config from "../config.js";


import { logger } from "../lib/logger.js";
import { givePoint } from "../lib/voteGive.js";




export async function getOneUser(req, res) {
  try {
    console.log("ID reçu dans req.params:", req.params);
    const { id } = req.params;
    const idUser = parseInt(id);
    
    // Utiliser Sequelize avec un paramètre dynamique
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
          as: 'participations', // Assurez-vous que c'est le bon alias
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
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      id: user.id,
      pseudo: user.pseudo,
      email: user.email,
      score_global: user.score_global,
      description: user.description,
      badges: user.receivedBadges.map(r => r.badge), // Les badges associés
      challenges: user.challenges, // Ici, on utilise directement les challenges
      participate: user.participations // Ici, on utilise directement les participations
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

  


// =========================================
// ====== CONTROLLERS (AUTHENTICATION) =====
// =========================================

// 🔹 Définition du schéma de validation avec Zod
const createUserBodySchema = z.object({
    email: z.string().email("L'email est invalide."), // 🔄 Convertit l'email en minuscule
    pseudo: z.string().min(1, "Le pseudo est requis."),
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
    confirmPassword: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
    description: z.string().min(1, "Une description est requise."),
  });

export async function signupUser(req, res) {
    try {
        console.log("🛠 Requête reçue:", req.body);

        // 🔍 Validation avec safeParse()
        const result = createUserBodySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }

        const { pseudo, email, password, description } = result.data;
          // 🔍 Vérifier si l'email existe déjà
          const existingEmail = await Account.findOne({ where: { email } });
          if (existingEmail) {
              return res.status(400).json({ message: "Cet email est déjà utilisé." });
          }
  
          // 🔍 Vérifier si le pseudo existe déjà
          const existingPseudo = await Account.findOne({ where: { pseudo } });
          if (existingPseudo) {
              return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
          }
        // 🔒 Hachage du mot de passe
        const hashedPassword = await hash(password);

        // 📌 Création du nouvel utilisateur
        const newUser = await Account.create({
            pseudo,
            email,
            password: hashedPassword, // 🔒 On stocke uniquement le hash
            description
        });

        const account = await Account.findOne ({where: {email}});
        if (!account) { return res.status(401).json({ status: 401, message: "Invalid credentials" }); }

        // Génération des tokens
        const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(account);

        // Invalidation des anciens Refresh Tokens et sauvegarde du nouveau
        await RefreshToken.destroy({ where: { userId: account.id } });
        await RefreshToken.create({
          userId: account.id,
          token: unsaltedHash(refreshToken.token),
          expiresAt: refreshToken.expiresAt
        });

          // Définition des cookies de sécurité
        res.cookie("x-auth-token", accessToken.token, {
            maxAge: accessToken.expiresInMS,
            ...getCookieSecuritySettings()
        });

        res.cookie("x-auth-refresh-token", refreshToken.token, {
            maxAge: refreshToken.expiresInMS,
            path: "/api/auth/refresh",
            ...getCookieSecuritySettings()
        });

        // ✅ Réponse sans le mot de passe
        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            accessToken,
            refreshToken,
            ...(csrfToken && { csrfToken }),
            user: {
                id: account.id,
                pseudo: account.pseudo,  // 🔹 Ajoute le pseudo
                email: account.email,
                description: newUser.description
            }
        });
    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

export async function loginUser(req,res) {
    const Schema = z.object({
        email: z.string().email("L'email est invalide."),
        password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
    });

    const result = Schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const { email, password } = req.body;

    const account = await Account.findOne ({where: {email}});
    if (!account) { return res.status(401).json({ status: 401, message: "Invalid credentials" }); }

    const validPassword = await compare(password, account.password);

    if (!validPassword) {
      return res.status(401).json({ status: 401, message: "Invalid credentials" });
    }

     // Génération des tokens
    const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(account);

    // Invalidation des anciens Refresh Tokens et sauvegarde du nouveau
    await RefreshToken.destroy({ where: { userId: account.id } });
    await RefreshToken.create({
      userId: account.id,
      token: unsaltedHash(refreshToken.token),
      expiresAt: refreshToken.expiresAt
    });

      // Définition des cookies de sécurité
    res.cookie("x-auth-token", accessToken.token, {
        maxAge: accessToken.expiresInMS,
        ...getCookieSecuritySettings()
    });

    res.cookie("x-auth-refresh-token", refreshToken.token, {
        maxAge: refreshToken.expiresInMS,
        path: "/api/auth/refresh",
        ...getCookieSecuritySettings()
    });

    // Envoi de la réponse avec tous les tokens nécessaires
    res.json({
        accessToken,
        refreshToken,
        ...(csrfToken && { csrfToken }),
        user: {
            id: account.id,
            pseudo: account.pseudo,  // 🔹 Ajoute le pseudo
            email: account.email,
        }
    });
    
}

// export async function refreshAccessToken(req, res) {
//   // Récupération du refresh token depuis les cookies ou le body
//   const rawToken = req.cookies?.["x-auth-refresh-token"] || req.body?.refreshToken;

//   // Validation du token
//   const Schema = z.object({ refreshToken: z.string() });
//   const result = Schema.safeParse({ refreshToken: rawToken });
//   if (!result.success) {
//     throw new BadRequestError("Invalid refresh token format.");
//   }

//   const token = result.data.refreshToken;

//   // Recherche du token existant et de l'utilisateur associé
//   const existingAccount = await Account.findOne({
//     where: { refresh_token: unsaltedHash(token) }
//   });

//   if (!existingAccount) {
//     throw new BadRequestError("Invalid refresh token provided");
//   }

//   // Génération des nouveaux tokens
//   const { accessToken, refreshToken, csrfToken } = generateAuthenticationTokens(existingAccount);

//   // Mise à jour du token dans la base de données
//   await existingAccount.update({ refresh_token: unsaltedHash(refreshToken.token) });

//   // Définition des cookies sécurisés
//   res.cookie("x-auth-token", accessToken.token, {
//     maxAge: accessToken.expiresInMS,
//     ...getCookieSecuritySettings()
//   });

//   res.cookie("x-auth-refresh-token", refreshToken.token, {
//     maxAge: refreshToken.expiresInMS,
//     path: "/api/auth/refresh",
//     ...getCookieSecuritySettings()
//   });

//   // Envoi de la réponse avec tous les tokens
//   res.json({
//     accessToken,
//     refreshToken,
//     ...(csrfToken && { csrfToken })
//   });
// }



export async function logoutUser(req,res) { 
    authorization.clearToken(res) ;
    res.redirect('/') ;
}

function getCookieSecuritySettings() {
  return {
    httpOnly: true,  // ✅ Sécurise contre le JS
    secure: false,   // ✅ Ne pas forcer HTTPS en local
    sameSite: "Lax"  // ✅ Compatible avec les requêtes locales
  };
}

  export async function getLeaderboard(req, res) {
    try {
      const leaderboard = await Account.findAll({
        order: [['score_global', 'DESC']],
        limit: 50
      });
 
      if (!leaderboard) {
        return res.status(404).json({message:"Aucun leaderboard trouvé."});
      }
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error("🔥 Erreur serveur:", error);
      res.status(500).json({ message: "Erreur interne du serveur." });
    }
  }

  export async function updateScore(req, res) {
    try {
      const { userId } = req.params;
      const { point } = req.body;

      const newScore = await givePoint(userId, point);

      res.status(200).json({
        message: "Points ajoutés avec succès !",
        newScore
      });
    } catch(error) {
      res.status(400).json({
        message: error.message
      });
    }
  }

  export async function checkUser(req, res) {
    res.status(200).json({ message: "Token valide" });
}


// user.controller.js

export async function updateUser(req, res) {
  try {
    const { userId } = req.params;  // Récupérer l'ID de l'utilisateur à partir des paramètres de la route
    const { pseudo, email, description } = req.body;  // Récupérer les informations du body de la requête

    // Validation des données reçues (ajuster selon ce que tu veux autoriser comme modification)
    if (!pseudo || !email || !description) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await Account.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mise à jour des informations
    user.pseudo = pseudo;
    user.email = email;
    user.description = description;

    // Sauvegarde des modifications dans la base de données
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
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await Account.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Anonymiser l'utilisateur en ajoutant l'ID au pseudo pour le rendre unique
    user.pseudo = `Utilisateur supprimé-${user.id}`;  // Ajout de l'ID pour garantir l'unicité
    user.email = `deleted-user-${user.id}@example.com`;
    user.description = "Compte supprimé";
    user.password = await hash("deleted"); // Hachage d'un mot de passe aléatoire

    // Sauvegarde des modifications
    await user.save();

    res.status(200).json({ message: "Compte supprimé (anonymisé) avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}


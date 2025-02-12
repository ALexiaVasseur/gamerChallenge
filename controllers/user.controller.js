import { Account, RefreshToken, Badge, Challenge, Receive, Participate } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken,unsaltedHash } from "../crypto.js";
import { generateAuthenticationTokens } from "../lib/tokens.js";
import config from "../config.js";


import { logger } from "../lib/logger.js";




export async function getOneUser(req, res) {
    try {
      console.log("ID reçu dans req.params:", req.params);
        const { id }= req.params;
        const idUser = parseInt(id);
      // Utiliser Sequelize avec un paramètre dynamique
      const user = await Account.findOne({
        where: { id: idUser },
        attributes: ['id', 'pseudo', 'email', 'score_global', 'description'], // Assure-toi que le score est bien inclus
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
                attributes: ['id', 'title', 'description', 'rules', 'type', 'video_url']
            },
            {
                model: Participate,
                as: 'participations',
                include: [
                  {
                    model: Challenge,
                    as: 'challenge',
                    attributes: ['id', 'title', 'description', 'rules', 'type', 'video_url']
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
        description: user.description, // 🔥 Ajout de la description ici
        badges: user.receivedBadges.map(r => r.badge), // Les badges associés
        challenges: user.challenges.map(r => r.challenge), // Les challenges fait associés
        participate: user.participations.map(r => r.participateChallenge) // Les challenges participé fait associés
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
        const existingUser = await Account.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
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
        
        // ✅ Réponse sans le mot de passe
        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            user: {
                id: newUser.id,
                pseudo: newUser.pseudo,
                email: newUser.email,
                description: newUser.description
            },
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
      httpOnly: true, // Client code cannot access cookie
      secure: config.auth.cookies.secure, // Only send cookie via HTTPS
      sameSite: config.auth.sameSiteCookiePolicy // Allow cookie to be sent to cross-origin servers
    };
  }
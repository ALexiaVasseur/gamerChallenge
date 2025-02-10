import { Account } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import { z } from "zod"; // Import de Zod
import { hash, compare, generateJwtToken, verifyJwtToken,unsaltedHash } from "../crypto.js";
import { generateAuthenticationTokens } from "../lib/tokens.js";
import { logger } from "../lib/logger.js";


// =========================================
// ====== CONTROLLERS (AUTHENTICATION) =====
// =========================================

// 🔹 Définition du schéma de validation avec Zod
const createUserBodySchema = z.object({
    pseudo: z.string().min(1, "Le pseudo est requis."),
    email: z.string().email("L'email est invalide.").transform(email => email.toLowerCase()), // 🔄 Convertit l'email en minuscule
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
});

export async function signupUser(req, res) {
    try {
        console.log("🛠 Requête reçue:", req.body);

        // 🔍 Validation avec safeParse()
        const result = createUserBodySchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }

        const { pseudo, email, password } = result.data;

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
        });

        // ✅ Réponse sans le mot de passe
        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            user: {
                id: newUser.id,
                pseudo: newUser.pseudo,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
}

export async function loginUser(req,res) {
    const Schema = z.object({
        email: z.string().email("L'email est invalide.").transform(email => email.toLowerCase()), // 🔄 Convertit l'email en minuscule
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
        ...(csrfToken && { csrfToken })
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
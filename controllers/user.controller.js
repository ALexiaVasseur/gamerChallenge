import { Account } from "../models/index.js"; // Adapte le chemin selon ta structure de dossiers
import bcrypt from "bcrypt";
import { z } from "zod"; // Import de Zod

// 🔹 Définition du schéma de validation avec Zod
const createUserBodySchema = z.object({
    pseudo: z.string().min(1, "Le pseudo est requis."),
    email: z.string().email("L'email est invalide.").transform(email => email.toLowerCase()), // 🔄 Convertit l'email en minuscule
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
});

export async function createUser(req, res) {
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
        const hashedPassword = await bcrypt.hash(password, 12);

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


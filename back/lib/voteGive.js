import { Account } from "../models/index.js";

export async function givePoint(userId, point) {
    if (!userId || !point) {
        throw new Error("userId et point sont requis.");
    }

    if (point < 1 || point > 5) {
        throw new Error("Les points doit être entre 1 et 5.");
    }

    try {
        const userAccount = await Account.findByPk(userId);
        if (!userAccount) {
            throw new Error("Utilisateur non trouvé");
        }

        const newScore = userAccount.score_global + point;
        await userAccount.update({ score_global: newScore });

        return newScore;
    } catch(error) {
        console.error("Erreur lors de la mise à jour du score :", error);
        throw error;
    }
}

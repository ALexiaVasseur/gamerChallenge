import { Badge } from "../models/index.js";
import { NotFoundError} from "../lib/errors.js"

// recover all badges
export async function getAllBadges(req, res) {
  const badges = await Badge.findAll();
  res.status(200).json(badges); 
}

// recover a badge
export async function getOneBadge(req, res) {
  const badge = await Badge.findByPk(req.params.id);
  if (!badge) {
    throw new NotFoundError("Badge non trouvé.");
  }
  res.status(200).json(badge);
}





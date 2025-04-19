import crypto from 'crypto';

// Génére une clé secrète de 64 octets
const secret = crypto.randomBytes(64).toString('hex');

console.log('Generated Secret:', secret);

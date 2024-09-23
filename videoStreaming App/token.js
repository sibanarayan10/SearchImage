import crypto from 'crypto'

// Generate access token secret
const accessTokenSecret = crypto.randomBytes(64).toString('hex');
console.log("Access Token Secret:", accessTokenSecret);

// Generate refresh token secret
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
console.log("Refresh Token Secret:", refreshTokenSecret);
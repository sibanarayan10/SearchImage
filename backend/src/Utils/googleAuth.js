import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv'
dotenv.config({
  path:'./.env'
})

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_CALLBACKURL
);

export {oauth2Client};
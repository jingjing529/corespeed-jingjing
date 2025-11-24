import { google } from "googleapis";
import open from "open";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/callback" // redirect URI
);

const scopes = ["https://www.googleapis.com/auth/calendar"];

const url = oAuth2Client.generateAuthUrl({
  access_type: "offline", // important to get refresh token
  scope: scopes,
});

console.log("Open this URL in your browser:", url);

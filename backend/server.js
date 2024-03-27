import express from "express";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const auth = createOAuthAppAuth({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
});

app.get("/oauth/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenAuthentication = await auth({
      type: "oauth-user",
      code,
    });

    // Here you would usually store the access token in a session or similar
    console.log(tokenAuthentication);

    res.redirect(`/success?token=${tokenAuthentication.token}`);
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(500).send("Authentication Failed");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

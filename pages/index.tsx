import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import * as React from "react";
import Link from "../src/Link";
import oauth from "./api/_oauth";

const Home: NextPage = () => {
  const oauthUrl = oauth.generateAuthUrl({
    clientId: process.env.DISCORD_CLIENT_ID,
    scope: ["identify", "guilds"],
    redirectUri: process.env.DISCORD_REDIRECT_URL,
    responseType: "code",
  });

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Discord User stats
        </Typography>
        <Box maxWidth="sm">
          <Button
            variant="contained"
            size="large"
            component={Link}
            endIcon={<LoginIcon />}
            noLinkStyle
            href={oauthUrl}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

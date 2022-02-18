import DiscordOauth2 from 'discord-oauth2'

const oauth = new DiscordOauth2({
    version: 'v9',
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: process.env.DISCORD_REDIRECT_URL,
});

export default oauth;

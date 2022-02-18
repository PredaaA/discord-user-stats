import oauth from './_oauth'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const url = oauth.generateAuthUrl({
        clientId: process.env.DISCORD_CLIENT_ID,
        scope: ['identify', 'guilds'],
        redirectUri: process.env.DISCORD_REDIRECT_URL,
        responseType: 'code',
    })
    res.redirect(url)
}


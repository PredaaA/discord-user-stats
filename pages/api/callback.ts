import { PartialGuild, TokenRequestResult, User as _User } from 'discord-oauth2'
import DiscordHTTPError from 'discord-oauth2/lib/eris/errors/DiscordHTTPError'
import { Permissions, UserFlags, UserFlagsString } from 'discord.js'
import type { NextApiRequest, NextApiResponse } from 'next'
import oauth from './_oauth'
import defaultResponse from './_utils'

interface User extends _User {
    flags_formatted?: UserFlagsString[],
    public_flags_formatted?: UserFlagsString[],
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.query.code) {
        return res.status(200).json(defaultResponse(false, 'No code.'))
    }

    try {
        const tokenRequestResult: TokenRequestResult = await oauth.tokenRequest({
            code: String(req.query.code),
            scope: "identify guilds",
            grantType: "authorization_code",
        })
        let userInfo: User = await oauth.getUser(tokenRequestResult.access_token)
        const userGuilds: PartialGuild[] = await oauth.getUserGuilds(tokenRequestResult.access_token)

        const flags = new UserFlags(userInfo.public_flags).toArray()
        userInfo.flags_formatted = flags
        userInfo.public_flags_formatted = flags

        let permissionsCount: Record<string, number> = {}
        for (const permission of Object.keys(Permissions.FLAGS)) {
            permissionsCount[permission] = 0
        }
        let totalGuilds = 0
        let ownedGuilds = 0
        for (const guild of userGuilds) {
            totalGuilds += 1
            if (guild.owner) {
                ownedGuilds += 1
            }
            if (guild.permissions) {
                const permissions = new Permissions(BigInt(guild.permissions)).toArray()
                for (const permission of permissions) {
                    permissionsCount[permission] += 1
                }
            }
        }
        const permissionsSorted = Object.fromEntries(
            Object.entries(permissionsCount).sort(([, a], [, b]) => b - a)
        )

        res.status(200).json(
            defaultResponse(
                true,
                null,
                { 'user': userInfo, 'userGuilds': { count: totalGuilds, ownedGuilds: ownedGuilds, permissions: permissionsSorted }}
            )
        )

    } catch (exc) {
        if (exc instanceof DiscordHTTPError) {
            res.redirect('/api/login')
        } else {
            console.log(exc)
            res.status(500).json(defaultResponse(false, 'Failed to fetch user infos.'))
        }
    }
}

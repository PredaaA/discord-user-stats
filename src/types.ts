import { User as _User } from 'discord-oauth2'
import { UserFlagsString } from 'discord.js'

export interface ApiResponse {
    success: boolean,
    message: string | null,
    data: CallbackResponse
}

export interface CallbackResponse {
    user: User,
    userGuilds: UserGuilds
}

export interface User extends _User {
    flags_formatted?: UserFlagsString[],
    public_flags_formatted?: UserFlagsString[],
}

export interface UserGuilds {
    count: number,
    ownedGuilds: number,
    permissions: { [k: string]: number },
}

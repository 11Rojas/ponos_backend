import { config } from "@/config";
import IUser from "@/interfaces/User";
import JwtService from "@/services/jwt/jwt.service";
import UserService from "@/services/users/user.service";
import { Hono } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ErrorCodes } from "@/types/errors";

const meRouter = new Hono();

interface JWTPayload {
    email: string;
    username: string;
}

meRouter.get('/', async (c) => {
    const jwtService = new JwtService();
    const userService = new UserService();

    // Obtener cookies
    const [accessToken, refreshToken] = await Promise.all([
        getSignedCookie(c, String(config.JWT_SECRET), 'accessToken') as Promise<string>,
        getSignedCookie(c, String(config.REFRESH_TOKEN_SECRET), 'refreshToken') as Promise<string>
    ]);

    if (!accessToken && !refreshToken) {
        return c.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let payload: JWTPayload | null = null;

    // Verificar accessToken
    try {
        if (accessToken) {
            payload = jwtService.verifyAccessToken(accessToken) as JWTPayload;
        }
    } catch (error) {
        payload = null;
    }

    // Si el accessToken es inválido, intenta refrescarlo
    if (!payload && refreshToken) {
        try {
            const refreshResponse = await jwtService.verifyRefreshToken(refreshToken);
            if (refreshResponse.status !== 200 || !refreshResponse.email || !refreshResponse.username) {
                return c.json({ message: refreshResponse.message }, { status: refreshResponse.status as ContentfulStatusCode });
            }

            // Regenerar token
            const newAccessToken = jwtService.generateAccessToken({
                email: refreshResponse.email,
                username: refreshResponse.username
            });

            await setSignedCookie(c, 'accessToken', newAccessToken, String(config.JWT_SECRET), {
                maxAge: 60 * 15,
                domain: 'localhost',
                sameSite: 'Lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });

            payload = { 
                email: refreshResponse.email, 
                username: refreshResponse.username 
            };
        } catch (error) {
            return c.json({ message: 'Unauthorized' }, { status: 401 });
        }
    }

    if (!payload) {
        return c.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verificar si el usuario existe
    const user = await userService.checkUserExists(payload.email) as IUser;
    if (!user) {
        return c.json({ message: "Usuario no encontrado" }, { status: 404 });
    }



    // Verificación de IP
    // const ip = c.req.header('x-forwarded-for') || 'unknown';
    // const checkIP = await userService.checkUserIP(user, ip);

    // if (checkIP.status === 400) {
    //     await userService.verifiyIP(payload.email, ip);
    // }

   
    return c.json({ status: 200, user });
});

export default meRouter;

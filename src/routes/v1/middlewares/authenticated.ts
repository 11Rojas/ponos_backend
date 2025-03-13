import { MiddlewareHandler } from "hono";
import JwtService from "@/services/jwt/jwt.service";
import { getSignedCookie } from "hono/cookie";
import { config } from "@/config";
import UserService from "@/services/users/user.service";
import type { JwtPayload } from "jsonwebtoken";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const jwtService = new JwtService();
    const userService = new UserService();
    // Obtener token de la cookie
    const accessToken = await getSignedCookie(c, String(config.JWT_SECRET), "accessToken");
    if (!accessToken) {
        return c.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verificar token
    const payload = jwtService.verifyAccessToken(accessToken);
    if (!payload) {
        return c.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Type guard to ensure payload is JwtPayload
    if (typeof payload !== 'string' && 'email' in payload) {
        const userResponse = await userService.checkUserExists(payload.email);
        // Guardar usuario en el contexto para acceder en las rutas
        c.set("user", userResponse);
    } else {
        return c.json({ message: "Invalid token payload" }, { status: 401 });
    }

    await next();
};

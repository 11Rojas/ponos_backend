import { Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { z } from "zod";

// Services
import JwtService from "@/services/jwt/jwt.service";
import { UserService } from "@/services/users/user.service";

// Types
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { config } from "@/config";
import Cookies from "@/services/cookies/cookies.service";
import CookiesService from "@/services/cookies/cookies.service";

const LoginRoute = new Hono();

LoginRoute.post('/signin', async (c) => {
    try {
        const data = await c.req.json();

        const LoginDTO = z.object({
            email: z.string().email('Email inválido'),
            password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
        });

        // Validar datos con safeParse para evitar excepciones no manejadas
        const validation = LoginDTO.safeParse(data);
        if (!validation.success) {
            return c.json({ errors: validation.error.errors.map(e => e.message) }, { status: 400 });
        }

        const userService = new UserService();
        const loginResponse = await userService.loginUser(data);

        if (loginResponse.status !== 200) {
            return c.json({ message: loginResponse.message }, { status: loginResponse.status as ContentfulStatusCode });
        }

        const jwtService = new JwtService();
        const { email, username, id } = loginResponse.user!;

        const accessToken = jwtService.generateAccessToken({ email, username });
        const refreshToken = jwtService.generateRefreshToken({ email, username });

        // Obtener IP y User Agent
        const ip = c.req.header('x-forwarded-for') ||
            c.req.header('x-real-ip') ||
            c.req.header('cf-connecting-ip') ||
            c.req.header('true-client-ip') ||
            c.req.header('fastly-client-ip') ||
            c.req.header('x-remote-addr') ||
            'unknown';

        const userAgent = c.req.header('user-agent') || 'unknown';

        if (userAgent === 'unknown') {
            return c.json({ message: "No se pudo obtener el User Agent" }, { status: 400 });
        }

        // Guardar Refresh Token en la base de datos
        await jwtService.saveRefreshToken(id, refreshToken, ip, userAgent);

        //Cookies service
        const cookieService = new CookiesService()
        // Configuración de cookies
        const isProduction = process.env.NODE_ENV === 'production';


        await cookieService.setSigned(c,  'accessToken', accessToken, String(config.JWT_SECRET), true, isProduction, Number(60*15), 'Lax', 'localhost')

        await cookieService.setSigned(c, 'refreshToken', refreshToken, String(config.REFRESH_TOKEN_SECRET), true, isProduction, Number(60*60*24*7), 'Lax', 'localhost')

        return c.json({
            message: "Usuario logueado con éxito",
            user: loginResponse.user
        }, { status: 200 });

    } catch (error) {
        console.error("Error en login:", error);
        return c.json({ message: "Internal server error" }, { status: 500 });
    }
});

export default LoginRoute;

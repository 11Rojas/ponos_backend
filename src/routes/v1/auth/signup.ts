import { Hono } from "hono";
import { UserService } from "@/services/users/user.service";
import { z } from "zod";
import UserDTO from "@/dto/user";
import { setSignedCookie } from "hono/cookie";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import JwtService from "@/services/jwt/jwt.service";
import { config } from "@/config";
import { VerificationService } from "@/services/verification/verification.service";

const SignUpRoute = new Hono();

SignUpRoute.post('/signup', async (c) => {
    try {
        const verificationService = new VerificationService(); 
        const data = await c.req.json();
        // Validar datos con safeParse
        const validation = UserDTO.safeParse(data);
        if (!validation.success) {
            console.log(validation.error.errors)
            return c.json({ message: validation.error.errors.map(e => e.message) }, { status: 400 });
        }

            
        const { code, email } = await c.req.json()
        const result = await verificationService.verifyCode(email, code)
        console.log(result)
        if(!result) return c.json({ message: "No pudimos verificar tu correo"}, 409)
         const verifyEmail = await verificationService.verifyEmail(email)

        const userService = new UserService();
        const userResponse = await userService.createUser(data);

        if (userResponse.status !== 200) {
            return c.json({ message: userResponse.message }, { status: userResponse.status as ContentfulStatusCode });
        }

        const jwtService = new JwtService();
        const accessToken = jwtService.generateAccessToken({ 
            email: userResponse.user?.email as string, 
            username: userResponse.user?.username as string ,
        });

        const refreshToken = jwtService.generateRefreshToken({ 
            email: userResponse.user?.email as string, 
            username: userResponse.user?.username as string 
        });

        // Guardar Refresh Token en la base de datos
        const ip = c.req.header('x-forwarded-for') || 'unknown';
        const userAgent = c.req.header('user-agent') || 'unknown';
        console.log(userResponse)
        await jwtService.saveRefreshToken(userResponse.user?._id as string, refreshToken, ip, userAgent);

        // Setear cookies seguras
      // Configuración de cookies sin restricciones
await setSignedCookie(c, 'accessToken', accessToken, String(config.JWT_SECRET), { 
    httpOnly: false, 
    secure: false,  // Desactivar secure para desarrollo (solo en dev)
    maxAge: 60 * 15,  // 15 minutos
    sameSite: 'Lax',  
    domain: 'localhost'  // Puede usar localhost o dejarlo vacío para cualquier dominio
});

await setSignedCookie(c, 'refreshToken', refreshToken, String(config.REFRESH_TOKEN_SECRET), { 
    httpOnly: false, 
    secure: false,  // Desactivar secure para desarrollo (solo en dev)
    maxAge: 60 * 60 * 24 * 7,  // 7 días
    sameSite: 'Lax',  
    domain: 'localhost'  // Similar aquí, usa 'localhost' o vacíalo para cualquier dominio
});


        return c.json({ message: "Usuario creado con éxito", user: userResponse.user }, { status: 200 });

    } catch (error) { 
        console.log(error)
        if (error instanceof z.ZodError) {
            return c.json({ message: error.errors.map(e => e.message) }, { status: 400 });
        }

        console.error("Error en signup:", error);
        return c.json({ message: "Internal server error" }, { status: 500 });
    }
});

export default SignUpRoute;

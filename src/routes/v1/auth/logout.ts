import { Context, Hono } from 'hono'
import type { Variables } from '@/types/hono'
import {deleteCookie } from "hono/cookie";

const logoutRoute = new Hono<{ 
  Variables: Variables;
  Bindings: {};
}>();


logoutRoute.post('/logout',  async (c) => {

    const isProduction = process.env.NODE_ENV === 'production';

      // Borrar las cookies específicas y asegurarse de que el path y otros parámetros sean correctos
      await deleteCookie(c, 'accessToken', {
        httpOnly: true,
                secure: isProduction,
                maxAge: 0, // 7 días
                sameSite: 'Lax',
                domain: 'localhost'
      });
      await deleteCookie(c, 'refreshToken', {
        httpOnly: true,
                secure: isProduction,
                maxAge: 0, // 7 días
                sameSite: 'Lax',
                domain: 'localhost'
      });
    
      return c.json({ message: 'Sesión destruida' });
    
})

export default logoutRoute
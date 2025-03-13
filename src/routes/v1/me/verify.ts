import JwtService from "@/services/jwt/jwt.service";
import RedisServer from "@/services/redis/redis";
import { Hono } from "hono";
import { JwtPayload } from "jsonwebtoken";

const verifyRoute = new Hono() 

verifyRoute.get('/verify', async (c) => {
    const jwtService = new JwtService()
    const redisServer = new RedisServer()
    const token = c.req.query('token')
    if(!token) return c.json({ message: 'Token no proporcionado' }, { status: 400 })
    const response = jwtService.verifyAccessToken(token) as JwtPayload
    const tokencache = await redisServer.get(response.email as string)
    if(tokencache !== token) return c.json({ message: 'Token inválido' }, { status: 401 }) 
    if(!response.temp) return c.json({ message: 'Token inválido' }, { status: 401 }) 
    if(response.status === 401) return c.json({ message: 'Token inválido' }, { status: 401 }) 

    await jwtService.deleteTempToken(response)

    return c.json({ message: 'Token válido' }, { status: 200 })
})

export default verifyRoute


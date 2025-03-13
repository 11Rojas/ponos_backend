import connectDB from "@/database/connection";
import UserModel from "@/database/models/user.model";
import RedisServer from "@/services/redis/redis";
import UserService from "@/services/users/user.service";
import { VerificationService } from "@/services/verification/verification.service";
import { Hono } from "hono";

const generateCode = new Hono()

generateCode.post('/generate-code', async (c) => {
    const verifyService = new VerificationService();
    const redisService = new RedisServer()
    const { email } = await c.req.json();

    //Verificar si el correo ya existe
    await connectDB()
    const checkEmail = await UserModel.findOne({ email})
    if(checkEmail) return c.json({ message: "Este correo ya esta usado"}, 409)
    const check = await redisService.get(email)
    if(check)  return c.json({ message: "Codigo solicitado recientemente, espera unos segundos"}, 409)
    const response = await verifyService.sendVerificationEmail(email)
    
    return c.json({message: "Codigo solicitado"}, 200)
})


export default generateCode
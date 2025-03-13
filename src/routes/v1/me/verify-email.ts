import { VerificationService } from "@/services/verification/verification.service";
import { Hono } from "hono";

const verifyEmailRouter = new Hono()

verifyEmailRouter.post('/:email', async (c) => {
    const { code, email } = await c.req.json()
    const verificationService = new VerificationService()
    const result = await verificationService.verifyCode(email, code)
    if(!result) return c.json({ message: "No pudimos verificar tu correo"}, 409)
     const verifyEmail = await verificationService.verifyEmail(email)
    
    return c.json({ result })
})


export default verifyEmailRouter
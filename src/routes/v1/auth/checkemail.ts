import UserService from '@/services/users/user.service';
import { Hono } from 'hono';


const checkMail = new Hono()



checkMail.post("/check-email", async (c) => {

    const { email } = await c.req.json()
    const userService = new UserService()

    const user = await userService.checkUserExists(email);
    if(user) return c.json({ message: "Existe este email"}, 409)
        
    return c.json({ message: "No existe este email"}, 200)

})

export default checkMail
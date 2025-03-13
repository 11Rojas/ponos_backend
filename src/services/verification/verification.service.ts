import UserModel from "@/database/models/user.model";
import { MailService } from "../mails/mail.service";
import RedisServer from '@/services/redis/redis';
import connectDB from "@/database/connection";

export class VerificationService {
    private mailService: MailService
    private redisService: RedisServer
    constructor() {
        this.mailService = new MailService()
        this.redisService = new RedisServer()
        connectDB()
    }

    async sendVerificationEmail(to: string) {
        //Generate code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisService.set(to, code, 60 * 15)
        await this.mailService.sendVerificationEmail(to, code)
    }

    async verifyCode(to: string, code: string) {
        const storedCode = await this.redisService.get(to)
        if(storedCode === code) return true
        return false
    }

    async verifyEmail(to: string) {
        const user = await UserModel.findOne({ email: to })
        if(!user) return false
        user.emailVerified = true
        await user.save()
        await this.redisService.delete(to)
        return true
    }
}

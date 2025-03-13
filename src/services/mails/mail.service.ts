import { config } from '@/config'
import * as nodemailer from 'nodemailer'
export class MailService {
    private transporter: nodemailer.Transporter 
    
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD
            }
        })
    }

    async sendMail(to: string, subject: string, text: string) {
        const mailOptions: nodemailer.SendMailOptions = {
            from: config.EMAIL_USER,
            to,
            subject,
            html: text
        }
        await this.transporter.sendMail(mailOptions)
    }

    async sendVerificationEmail(to: string, code: string) {
        const subject = "Verificación de correo electrónico"
        const text = `Por favor, ingresa el siguiente código para verificar tu correo electrónico: ${code}`
        await this.sendMail(to, subject, text)
    }
}

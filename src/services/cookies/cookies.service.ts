import { Context } from "hono";
import { setSignedCookie } from "hono/cookie";

export default class CookiesService {

    constructor(){}

    async setSigned(context:Context, name:string, value: string, secret: string, httpOnly: boolean, secure: boolean, maxAge: number, sameSite: string, domain: string){
       return await  setSignedCookie(context, name, value, secret, {
            httpOnly,
            secure,
            maxAge,
            sameSite,
            domain
        })

    }

}
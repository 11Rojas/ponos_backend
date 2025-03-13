import connectDB from "../../database/connection";
import UserModel from "../../database/models/user.model";
import * as bcrypt from 'bcrypt'
// Types
import type IUser from "../../interfaces/User";
//Services
import { MailService } from "../mails/mail.service";
import JwtService from "../jwt/jwt.service";
import RedisServer from "../redis/redis";

export class UserService {
  private userModel = UserModel;
  private redisServer: RedisServer
  private jwtService: JwtService
  private mailService: MailService
  constructor() {
    this.redisServer = new RedisServer()
    this.jwtService = new JwtService()
    this.mailService = new MailService()
    // Garantizar la conexión a la base de datos
    connectDB()
      .then(() => console.log("Conexión a la base de datos establecida."))
      .catch((err) => console.error("Error al conectar a la base de datos:", err));
  }

  /**
   * Verifica si el usuario existe en la base de datos.
   * @param email - El correo electrónico del usuario.  
   * @returns True si el usuario existe, false en caso contrario.
   */

  async checkUserExists(email: string): Promise<boolean | IUser> {
    const user = await this.userModel.findOne({ email });
    if(!user) return false
    return user
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param user - Datos del usuario, excluyendo campos generados automáticamente.
   * @returns Objeto con mensaje, estado y el usuario creado.
   */
  
  async createUser(
    user: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<{ message: string; status: number; user?: IUser }> {
    try {
      // Generar un ID único basado en el conteo actual de documentos
      const id = (await this.userModel.countDocuments()) + 1;

      // Verificar si el usuario ya existe
      const userExists = await this.checkUserExists(user.email);
      if (userExists) {
        return {
          message: "El usuario ya existe",
          status: 400,
        };
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Crear una nueva instancia del usuario
      const newUser = new this.userModel({
        ...user,
        id,
        password: hashedPassword,
        isActive: false
      });

      // Guardar el usuario en la base de datos
      await newUser.save();

      return {
        message: "Usuario creado con éxito",
        status: 200,
        user: newUser.toObject() as IUser, // Asegurar el tipado
      };
    } catch (error) {
      console.error("Error creando usuario:", error);

      // Lanzar un error controlado
      return {
        message: "Error al crear usuario",
        status: 500,
      };
    }
  }

  async loginUser(user:{ email: string, password: string }): Promise<{ message: string; status: number; user?:{ email: string, username: string, id: string } }> {
    try {
      const userExists = await this.checkUserExists(user.email);
      if (!userExists || typeof userExists === 'boolean') {
        return {
          message: "El usuario no existe",
          status: 400,
        };
      }

      const isPasswordCorrect = await bcrypt.compare(user.password, userExists.password);
      if(!isPasswordCorrect)  return {
          message: "La contraseña es incorrecta",
          status: 400,
        };


      
      return {
        message: "Usuario logueado con éxito",
        status: 200,
        user: {
          email: userExists.email,
          username: userExists.username,
          id: userExists.id,
        }
      }


    } catch (error) {
      return {
        message: "Error en el inicio de sesión",
        status: 500
      };
    }
  }

  /**
   * Compara la dirección IP del usuario con las direcciones IP donde ya ha iniciado sesión.
   * @param ip - La dirección IP del usuario.
   * @returns True si la IP está permitida, false en caso contrario.
   */

  async checkUserIP(user:IUser, ip:string): Promise<{ message?: string, status: number }> {
    if(!user.ips) return { message: "Dirección IP no reconocida", status: 400 }

    if(!user.ips.includes(ip)) return { message: "Dirección IP no reconocida", status: 400 }


    return { status: 200 }
  }

  /**
   * Verifica la IP del usuario y envía un correo electrónico con un enlace para verificar la IP.
   * @param email - El correo electrónico del usuario.
   * @param ip - La dirección IP del usuario.
   * @returns Objeto con mensaje y estado.
     */

  async verifiyIP(email: string, ip: string): Promise<{ message?: string, status: number }> {
    const user = await this.userModel.findOne({ email });
    if (!user) return { message: "Usuario no encontrado", status: 404 };

    const tempToken = await this.jwtService.generateTempToken({ email, username: user.username })
    const isSendEmail = await this.redisServer.get(email)
    if(!isSendEmail) {
      await this.mailService.sendMail(email, "IP no reconocida", `<a href="http://localhost:3000/api/v1/me/verify?token=${tempToken}">Verificar IP HIJO DE PUTA</a>`);
      await this.redisServer.set(email, tempToken, 60 * 15)
    }

    return { status: 200 };
  }

  async getUserById(id:string){
    const user = await UserModel.findById(id)
    if(!user) return false
    return user

  }

}

export default UserService;

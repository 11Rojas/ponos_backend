import { z } from "zod";
import type IUser from "../interfaces/User";

const UserDTO = z.object({
    username: z.string(),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    _id: z.string().optional(),
}) satisfies z.ZodType<Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'ips' | 'isActive' | 'emailVerified' | 'image' | 'bio' | 'location' | 'website' | 'followers' | 'following' | 'products'>>;

export default UserDTO;
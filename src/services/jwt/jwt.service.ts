import * as jwt from 'jsonwebtoken';
import { config } from '@/config';
const ms = require('ms') 

// Models
import RefreshTokenModel from '@/database/models/refreshToken.model';

// Types
import type { SignOptions, Secret } from 'jsonwebtoken';
import RedisServer from '../redis/redis';

class JwtService {
    private accessTokenSecret: Secret;
    private accessTokenExpiration: jwt.SignOptions['expiresIn'];
    private refreshTokenSecret: Secret;
    private refreshTokenExpiration: jwt.SignOptions['expiresIn'];
    private redisServer: RedisServer
    constructor() {
        this.accessTokenSecret = config.JWT_SECRET || '';
        this.accessTokenExpiration = config.ACCESS_TOKEN_EXPIRATION as jwt.SignOptions['expiresIn'];
        this.refreshTokenSecret = config.REFRESH_TOKEN_SECRET || '';
        this.refreshTokenExpiration = config.REFRESH_TOKEN_EXPIRATION as jwt.SignOptions['expiresIn'];

        if (!this.accessTokenSecret || !this.refreshTokenSecret) {
            throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be defined');
        }
        this.redisServer = new RedisServer()
    }

    generateAccessToken(payload: { email: string, username: string,  }) {
        const options: SignOptions = {
            expiresIn: this.accessTokenExpiration,
        };
        return jwt.sign(payload, this.accessTokenSecret as jwt.Secret, options);
    }

    verifyAccessToken(token: string) {
        try {
            // Aquí el método verify automáticamente valida la expiración
            const decoded = jwt.verify(token, this.accessTokenSecret);
            return decoded;  // Devuelve el payload decodificado si es válido
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // Si el error es un TokenExpiredError, es porque el token ha expirado
                return { message: 'Access token expirado', status: 401 };
            }
            return { message: 'Access token inválido', status: 401 };
        }
    }

    generateRefreshToken(payload: { email: string, username: string }) {
        const options: SignOptions = {
            expiresIn: this.refreshTokenExpiration,
        };
        return jwt.sign(payload, this.refreshTokenSecret as jwt.Secret, options);
    }

    async verifyRefreshToken(token: string): Promise<{ message: string, status: number, email?: string, username?: string }> {
        const refreshToken = await RefreshTokenModel.findOne({ token });
        if (!refreshToken) return { message: 'Refresh token no encontrado', status: 404 };
        if (refreshToken.isRevoked) return { message: 'Refresh token revocado', status: 400 };
        if (refreshToken.expiresAt < new Date()) return { message: 'Refresh token expirado', status: 400 };

        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret) as { email: string, username: string };
            return { 
                message: 'Refresh token válido', 
                status: 200, 
                email: decoded.email,
                username: decoded.username 
            };
        } catch (error) {
            return { message: 'Token inválido', status: 401 };
        }
    }

    async saveRefreshToken(userId: string, token: string, ipAddress: string, userAgent: string) {
        await this.revokeRefreshToken(userId)
        const expiresIn = ms(this.refreshTokenExpiration as string)

        const expiresAt = new Date(Date.now() + expiresIn)
        const refreshToken = new RefreshTokenModel({ 
            userId, 
            token, 
            ipAddress, 
            userAgent,
            expiresAt
        });

        await refreshToken.save();
        return refreshToken;
    }

    async revokeRefreshToken(userId: string) {
        const result = await RefreshTokenModel.updateMany(
            { userId, isRevoked: false }, 
            { isRevoked: true }
        );
        
        if (result.matchedCount === 0) {
            return { message: 'No se encontraron tokens para revocar', status: 404 };
        }
        
        return { message: 'Tokens revocados exitosamente', status: 200 };
    }

    async generateTempToken(payload: { email: string, username: string }) {
        const options: SignOptions = {
            expiresIn: '10m'
        }
        const token = jwt.sign({...payload, temp: true}, this.accessTokenSecret as jwt.Secret, options)
        return token
    }

   async deleteTempToken(payload:jwt.JwtPayload) {
        try {
            await this.redisServer.delete(payload.email)
            return { message: 'Token válido', status: 200 }
        } catch (error) {
            return { message: 'Token inválido', status: 401 }
        }
    }
}

export default JwtService;

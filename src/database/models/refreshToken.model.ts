import mongoose from "mongoose";

//Types
import IRefreshToken from '@/interfaces/Refresh_token'

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, },
    isRevoked: { type: Boolean, default: false },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
}, { timestamps: true })


const RefrehTokenModel = mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema) 

export default RefrehTokenModel

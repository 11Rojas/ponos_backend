import mongoose from "mongoose"

export default interface IRefreshToken {
    userId: mongoose.Schema.Types.ObjectId
    token: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    isRevoked: boolean,
    ipAddress: string,
    userAgent: string,
}

import mongoose from "mongoose";
import type IUser from '../../interfaces/User'


const UserSchema = new mongoose.Schema<IUser>({
    fullName: { type: String, required: true},
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ips: { type: [String], default: [] },
    phone:{ type: String, required: true },
    isActive: { type: Boolean, default: true},
    image: { type: String, default: null },
    bio: { type: String, default: null },
    location: { type: String, default: null },
    website: { type: String, default: null },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    shipping_information: [
        {
            postal_code: { type: String, required: true },
            country: { type: String, required: true },
            city: { type: String, required: true },
            address: { type: String, required: true },
            phone: { type: String, required: true },
            name: { type: String, required: true },
            isDefault: { type: Boolean, default: false },
        }
    ]
}, { timestamps: true })


const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;


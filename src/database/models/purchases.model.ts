import mongoose from "mongoose";

const purchasesSchema = new mongoose.Schema({
    status: { 
        type: String, 
        enum: ["activo", "procesado", "cancelado"],
        default: 'activo',
        required: true
    },
    buyerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Types.ObjectId, ref: "Product" },
    quantity: Number,
});

const purchasesModel = mongoose.models.purchases || mongoose.model("Purchases", purchasesSchema);
export default purchasesModel;
import mongoose from "mongoose";



const askSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    response: { type: String, required: true },
}, { timestamps: true })

// const ratingSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     rating: { type: Number, required: true },
//     comment: { type: String, required: true },
// }, { timestamps: true })

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    tags: { type: [String], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    isFeatured: { type: Boolean, required: true },
    isSale: { type: Boolean, required: true },
    details: [ { title: { type: String, required: true }, value: { type: String, required: true } }],
    ask: [askSchema],
    rating: { type: Number, default: 0},
}, { timestamps: true })


const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default ProductModel;

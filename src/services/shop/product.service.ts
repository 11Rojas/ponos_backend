import connectDB from "@/database/connection";
import ProductModel from "@/database/models/product.model";

import type { IProduct} from '@/interfaces/Product'

export default class ProductService {
    private ProductModel = ProductModel;

    constructor(){
         connectDB().then(() => console.log("Conexión a la base de datos establecida."))
         .catch((err) => console.error("Error al conectar a la base de datos:", err));
    }
    async verifyProperty(ownerId:string, productId:string): Promise<boolean> {
        const product = await this.ProductModel.findById(productId);
        if(product.owner._id != ownerId) return false;
        return true;
    }

    async getAllProducts(): Promise<IProduct[]> {
        return await this.ProductModel.find({});
    }

    async getProductById(productId: string): Promise<IProduct| null | boolean> {
      try {
        const product = await this.ProductModel.findById(productId).populate("owner", "username email createdAt")
        if(!product) return false
        return product
      } catch (error) {
        console.log(error)
      }
    }
    
    async createProduct(product: IProduct): Promise<IProduct> {
        return await this.ProductModel.create(product);
    }
    
    async updateProduct(productId: string, updatedProduct: Partial<IProduct>): Promise<IProduct | null> {
        return await this.ProductModel.findByIdAndUpdate(productId, updatedProduct, { new: true });
    }
    
    async deleteProduct(productId: string): Promise<IProduct | null> {
        return await this.ProductModel.findByIdAndDelete(productId);
    }

 

}
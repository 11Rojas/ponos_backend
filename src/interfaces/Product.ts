import { Types } from 'mongoose';

interface IAsk {
    // Define the structure of IAsk
}

interface IRating {
    // Define the structure of IRating
}

interface IDetail {
    // Define the structure of IDetail
}

interface IProduct {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    images: string[];
    stock: number;
    category: string;
    subCategory: string;
    tags: string[];
    owner: Types.ObjectId;
    isActive: boolean;
    isDeleted: boolean;
    isFeatured: boolean;
    isSale: boolean;
    isNew: boolean;
    details: IDetail[];
    ask?: IAsk[];
    rating?: IRating[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type { IProduct, IAsk, IRating, IDetail };

// Add this type for creation
export type CreateProductDTO = Pick<IProduct, 
  'name' | 'description' | 'price' | 'images' | 
  'stock' | 'category' | 'subCategory' | 'tags' | 
  'isActive' | 'isDeleted' | 'isFeatured' | 
  'isNew' | 'isSale' | 'details'
>; 
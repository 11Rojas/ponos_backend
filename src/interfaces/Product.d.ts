import type { Types } from 'mongoose';

interface IAsk {
    user: Types.ObjectId;
    question: string;
    response: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IRating {
    user: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IDetail {
    title: string;
    value: string;
}

interface IProduct {
    _id: Types.ObjectId;
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
    isNew: boolean;  // Nuevo producto en la lista de destacados
    details: IDetail[];
    ask: IAsk[];
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

export type { IProduct, IAsk, IRating, IDetail }; 
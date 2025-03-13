import { Context, Hono } from "hono";
import ProductModel from '@/database/models/product.model';
import connectToDatabase from '@/database/connection';

const getAllRoute = new Hono();

const getAllProducts = async (c:Context) => {
    await connectToDatabase()
    console.log(c.get('user'))
    const products = await ProductModel.find().populate('owner', 'password email', 'User')
    return c.json(products)
}


getAllRoute.get('/', getAllProducts)


export default getAllRoute;
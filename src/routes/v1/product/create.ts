import ProductModel from '@/database/models/product.model';
import { Hono } from 'hono'
import connectToDatabase from '@/database/connection';
import ProductService from '@/services/shop/product.service';

import type { IProduct} from '@/interfaces/Product';
import type { Variables } from '@/types/hono'


const createRoute = new Hono<{ 
  Variables: Variables;
  Bindings: {}; // Add empty bindings if you don't have any
}>();

//Ruta
createRoute.post('/', async (c) => {
  try {

    const ProductS = new ProductService()
    const user = await c.get('user');


      const data = await c.req.json();
  
      const payload: IProduct = {
        ...data,
        owner: user._id,
        ask: [],
        rating: []
      }
  
      await ProductS.createProduct(payload)
      
      return c.json({ message: 'Producto creado'}, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return c.json({ message: 'Error creando el producto', error: message }, { status: 500 })
  }
})

export default createRoute

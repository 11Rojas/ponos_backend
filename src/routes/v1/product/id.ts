import ProductService from '@/services/shop/product.service';
import { Hono } from 'hono';


const oneProductRoute = new Hono();



oneProductRoute.get('/item/:id', async (c) => {

    const productService = new ProductService()

    const id = c.req.param('id');

    const item = await productService.getProductById(id);
    if(!item) return c.json({ message: "Producto no encontrado"}, 404)
    return c.json(item)
})

export default oneProductRoute
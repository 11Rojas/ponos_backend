import { Context, Hono } from 'hono'
import type { Variables } from '@/types/hono'
import ProductService from '@/services/shop/product.service';

const editProduct = new Hono<{ 
  Variables: Variables;
  Bindings: {};
}>();

//Ruta

editProduct.post('/', async (c: Context<{ Variables: Variables; Bindings: {} }>) => {
    try {
        const ProductS = new ProductService()
        // Validar los datos

        const data = await c.req.json();
        // Asegurarse de que el usuario sea el dueño del producto
        if (!await ProductS.verifyProperty(c.get('user')._id, data._id)) {
            return c.json({ error: 'No tienes permisos para editar este producto' }, { status: 403 })
        }

        // Actualizar el producto en la base de datos
        const product = await ProductS.updateProduct(data._id, data)
         return c.json({ message: "Producto actualizado correctamente"})
         //

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return c.json({ error: message }, { status: 500 })
    }
})

export default editProduct

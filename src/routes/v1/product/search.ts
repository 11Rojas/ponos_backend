import { Context, Hono } from "hono";
import ProductModel from '@/database/models/product.model';
import connectDB from "@/database/connection";





const searchRoute = new Hono();

// Ruta de búsqueda
searchRoute.post('/search', async (c) => {
    await connectDB(); // Conexión a la base de datos

    // Obtener el parámetro de búsqueda 'name' desde los query params
    const {name} = await c.req.json()

    if (!name) {
        return c.json({ error: 'No search term provided' }, 400); // Si no se proporciona un término de búsqueda, responde con error
    }
    

    // Construir una búsqueda más eficaz: busca en el nombre del producto o en los tags
    try {
        // Utilizamos una expresión regular (regex) para una búsqueda flexible en el nombre del producto y los tags
        const productos = await ProductModel.find({
            $or: [
                { name: { $regex: name, $options: 'i' } }, // Coincidencia en el nombre, sin distinguir mayúsculas/minúsculas
                { tags: { $in: [name.toLowerCase()] } }, // Coincidencia en los tags
            ]
        }).limit(10); // Limitar la cantidad de resultados si es necesario

        // Si no se encuentran productos
        if (productos.length === 0) {
            return c.json([], 200);
        }
        console.log(name)
        
        // Devolver los productos encontrados
        return c.json(productos);
    } catch (error) {
        return c.json({ error: 'Error en la búsqueda de productos', details: error.message }, 500);
    }
});

export default searchRoute;

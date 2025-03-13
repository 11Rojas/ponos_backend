import {Hono } from 'hono';
import type { Context } from 'hono';
import ProductService from '@/services/shop/product.service';
const featuresRoute = new Hono()


featuresRoute.get("/features", async (c) => {

    const productService = new ProductService()

    const data = await productService.getAllProducts()
    return c.json(data)
})

export default featuresRoute
import { Hono } from 'hono';
import type { Variables } from '@/types/hono';
import ProductService from '@/services/shop/product.service';
import purchasesModel from '@/database/models/purchases.model';
import chatModel from '@/database/models/chat.model';

const buyRoute = new Hono<{ 
  Variables: Variables;
  Bindings: {};
}>();


//Cuando un cliente realice la compra abrir un chat entre cliente-vendedor

buyRoute.post('/', async (c) => {
  try {
    const ProductS = new ProductService()
    const user = await c.get('user');
    // Payload
    const data = await c.req.json();

   
    // Buscar un producto y ver si esta activo
    const item = await ProductS.getProductById(data._id);
    if(item?.isActive != true) return c.json({ message: 'Producto inactivo'}, 409);

     // Verificar si ya existe una orden activa para este producto
     const checkOrder = await purchasesModel.findOne({ 
        sellerId: item.owner._id,
        buyerId: user._id,
        item: item._id,
        status: 'activo' // Assuming you have a status field
      });
  
      if (checkOrder) {
        return c.json({ message: 'Ya tienes una orden activa para este producto' }, 409);
      }



    // Crear nueva compra 
   await new purchasesModel({
        sellerId: item.owner._id,
        buyerId: user._id,
        item: item._id,
        quantity: data.quantity,
    }).save();

    // Crear nuevo chat
    await new chatModel({
        sellerId: item.owner._id,
        buyerId: user._id,
        chat: [
            {
                sender: "Ponos automatico",
                message: "Gracias por usar nuestro sistema de compra, Sigue estas instrucciones..."
            }
        ]
    }).save();

    return c.json({ message: "OK"})
  } catch (error) {
    console.log(error)
  }
})


export default buyRoute
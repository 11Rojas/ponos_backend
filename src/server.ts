import { Hono } from 'hono';
import routes from './routes/v1';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger'
import { Server } from 'socket.io';
import { serve } from '@hono/node-server'
import { Server as HttpServer } from 'http'
import ChatModel from './database/models/chat.model';
import connectDB from './database/connection';

//Instances
const app = new Hono();
const server = serve(
  {
    fetch: app.fetch,
    port: 3000
  },
  (info) => {
    console.log(`Server corriendo: http://${info.address}:${info.port}`)
  }
)
// Middleware global para logging con morgan
app.use(logger())

app.get('/', (c) => {
  return c.json({ message: 'Hello World' }, { status: 200 });
});

// Configuración de CORS
app.use('*', cors({
  origin: '*',  // Cambia a la URL de tu frontend en producción
  credentials: true,  // Permite que las cookies sean enviadas
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Rutas V1
app.route('/api', routes);
//Soocketio
// Configurar Socket.IO con CORS
const io = new Server(server as HttpServer, {
  path: '/ws',
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true }
});

// io.on("connection", async (socket) => {
//   console.log("Cliente conectado:", socket.id);
//   await connectDB()
//   // Unirse a un chat privado entre comprador y vendedor
//   socket.on("joinChat", async ({ buyerId, sellerId }) => {
//     let chat = await ChatModel.findOne({ buyerId, sellerId });

//     socket.join(chat._id.toString()); // Unir al chat
//     socket.emit("chatHistory", chat.messages); // Enviar historial de mensajes
//   });

//   // Manejar envío de mensajes
//   socket.on("sendMessage", async ({ senderId, message }) => {
//     const chat = await ChatModel.findOne({ buyerId: senderId})
//     if (!chat) return;
//     console.log(chat.messages)
//     chat.messages.push({ sender: senderId, message: "asd" });
//     await chat.save();

//     io.to(chatId).emit("receiveMessage", newMessage); // Enviar a todos en el chat
//   });

//   socket.on("disconnect", () => console.log("Cliente desconectado:", socket.id));
// });



export default app;

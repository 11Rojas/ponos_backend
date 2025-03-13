import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, ref: "User", }, // ID del remitente
  message: { type: String, required: true }, // Contenido del mensaje
  date: { type: Date, default: Date.now }, // Fecha del mensaje
});

const chatSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Types.ObjectId, ref: "User", }, // Comprador
  sellerId: { type: mongoose.Types.ObjectId, ref: "User", }, // Vendedor
  messages: [messageSchema], // Lista de mensajes
  createdAt: { type: Date, default: Date.now }, // Fecha de creación del chat
});

const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default ChatModel;

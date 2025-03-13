import connectDB from "@/database/connection";
import ChatModel from "@/database/models/chat.model";
import { UserService } from "@/services/users/user.service";
import mongoose from "mongoose";
import type { Document } from "mongoose";

interface IMessage {
  message: string;
  sender: string;
  date: Date;
}

interface IChat extends Document {
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  chat: IMessage[];
}

export default class ChatService {
  private ChatModel = ChatModel;
  private UserService: UserService;

  constructor() {
    this.UserService = new UserService();
    connectDB();
  }

  // Obtener o crear un chat entre comprador y vendedor
  async getChat(buyerId: mongoose.Types.ObjectId, sellerId: mongoose.Types.ObjectId): Promise<IChat | null> {
    return await this.ChatModel.findOne({
      buyerId,
      sellerId,
    });
  }

  // Obtener un chat por su ID
  async getChatById(chatId: string): Promise<IChat> {
    const chat = await this.ChatModel.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    return chat;
  }

  // Enviar un mensaje en un chat específico
  async sendMessage(chatId: string, senderId: string, content: string): Promise<IMessage | { message: string }> {
    const chat = await this.getChatById(chatId);

    // Obtener username
    const user = await this.UserService.getUserById(senderId);
    if (!user) return { message: "No existe este usuario" };

    // Agregar el nuevo mensaje al array de chat
    const message: IMessage = {
      message: content,
      sender: user.username,
      date: new Date(),
    };
    chat.chat.push(message);

    await chat.save();

    // Retornar el mensaje agregado
    return message;
  }

  // Obtener todos los mensajes de un chat específico
  async getMessages(chatId: string): Promise<IMessage[]> {
    const chat = await this.getChatById(chatId);
    return chat.chat;
  }

  // Obtener los detalles del chat (quién está involucrado)
  async getChatDetails(chatId: string): Promise<{ chatId: string; buyer: any; seller: any; messages: IMessage[] }> {
    const chat = await this.getChatById(chatId);

    // Obtener los usuarios involucrados (buyer y seller)
    const buyer = await this.UserService.getUserById(chat.buyerId.toString());
    const seller = await this.UserService.getUserById(chat.sellerId.toString());

    return {
      chatId: chat._id.toString(),
      buyer,
      seller,
      messages: chat.chat,
    };
  }

  // Eliminar un mensaje del chat
  async deleteMessage(chatId: string, messageId: string): Promise<{ message: string }> {
    const chat = await this.getChatById(chatId);

    // Filtrar el mensaje a eliminar
    chat.chat = chat.chat.filter((message) => message._id.toString() !== messageId.toString());
    await chat.save();

    return { message: "Message deleted successfully" };
  }
}

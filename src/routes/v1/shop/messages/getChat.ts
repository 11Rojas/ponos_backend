import { Hono } from "hono";
import mongoose from "mongoose";
import ChatModel from "@/database/models/chat.model.js";
import type { Variables } from '@/types/hono';
import connectDB from "@/database/connection";

const chatRoutes = new Hono<{ 
    Variables: Variables;
    Bindings: {};
  }>();
  

  chatRoutes.post("/", async (c) => {
    try {
      await connectDB();
      
      const user = { _id: "67ae8a1a01d7a8c6c41274b2" };
      const sellerId = "679f6c0161d53a2b2b64da31";
  
      // Convert string IDs to ObjectId
      const buyerObjectId = new mongoose.Types.ObjectId(user._id);
      const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
      let chat = await ChatModel.findOne({ 
        buyerId: buyerObjectId, 
        sellerId: sellerObjectId 
      });
  
    
  
      return c.json({ chatId: chat._id, messages: chat.messages });
    } catch (error) {
      console.error(error);
      return c.json({ 
        error: "Error al obtener/crear chat",
      }, 500);
    }
  });
export default chatRoutes;

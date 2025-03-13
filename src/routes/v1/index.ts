import { Hono } from "hono";
import LoginRoute from "@/routes/v1/auth/signin";
import SignUpRoute from "@/routes/v1/auth/signup";  
import MeRoute from "@/routes/v1/me/user";
import VerifyRoute from "@/routes/v1/me/verify";
import CreateProductRoute from "@/routes/v1/product/create";
import GetAllProductsRoute from "@/routes/v1/product/getAll";
import buyRoute from "./shop/buy";
import { authMiddleware } from "@/routes/v1/middlewares/authenticated";
import chatRoutes from "./shop/messages/getChat";
import generateCode from "./me/generate-code";
import logoutRoute from "./auth/logout";
import searchRoute from "./product/search";
import featuresRoute from "./product/features";
import oneProductRoute from "./product/id";
import checkMail from "./auth/checkemail";
const routes = new Hono().basePath('/v1');

//Conectar en la db


//Auth
routes.route('/auth', LoginRoute)
routes.route('/auth', SignUpRoute)

//Me
routes.route('/me', MeRoute)

//verify
routes.route('/me', VerifyRoute)  

//Logout
routes.route('/auth', logoutRoute)

routes.route("/auth", checkMail)

//Get code 
routes.route('/me', generateCode)

//Middleware
// routes.use('/product/*', authMiddleware)
routes.use("/shop/*", authMiddleware)
//Create Product
routes.route('/product', CreateProductRoute)

//Get All Products
routes.route('/product', GetAllProductsRoute)

//Search Product
routes.route('/product', searchRoute)

//Get one product
routes.route('/product', oneProductRoute)

//Features products
routes.route('/product', featuresRoute);

//Buy
routes.route('/shop/buy', buyRoute)
routes.route("/shop/getOrCreateChat", chatRoutes)


export default routes;

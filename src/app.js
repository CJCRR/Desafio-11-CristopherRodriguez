import express from 'express';
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import connectToDB from "./config/dbConfig.js";

import routerProducts from './routes/products.js';
import routerCarts from './routes/carts.js';
import viewsRoutes from './routes/views.router.js'
import viewsUserRouter from "./routes/viewsUser.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import mailPurchaseRouter from './routes/mailPurchase.router.js'
import mockingRouter from './routes/mocking.router.js'
import loggerRouter from './routes/logger.router.js'

import socketProducts from './listeners/socketProducts.js';
import socketChat from './listeners/socketChat.js';

import session from "express-session"
import MongoStore from "connect-mongo"

import passport from 'passport'
import initializePassport from './config/passport.config.js'
import config from './config/config.js';
import errorHandler from './middleware/error.middleware.js'
import logger from './logger.js';


const port = config.port
const mongoURL = config.mongoURL
const mongoDBName = config.mongoDBName

const app = express();
app.use(express.json());
app.use(errorHandler)
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Handlebars configuracion
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views",`${__dirname}/views`);

// configuracion de la sesion
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoURL,
      dbName: mongoDBName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 200,
    }),
    secret: "code",
    resave: true,
    saveUninitialized: true,
  })
);

// configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRoutes);
app.use('/', viewsUserRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/email', mailPurchaseRouter);
app.use('/mockingproducts', mockingRouter);
app.use('/loggerTest', loggerRouter);

app.use((req, res) => {
  res.render("404");
});

connectToDB()

const httpServer = app.listen(port, () => {
  logger.info("Escuchando puerto 8080");
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketChat(socketServer)

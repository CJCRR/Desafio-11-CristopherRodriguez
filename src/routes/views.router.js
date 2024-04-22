import { Router } from 'express';

import { isAuthenticated, isAdmin, hasAdminCredentials } from "../public/js/authMiddleware.js";
import { 
  readViewsProductsController, 
  readViewsRealTimeProductsController, 
  readViewsProductController,
  readViewsCartController,
  readViewsChats
} from "../controllers/views.controller.js";

const router = Router();

// Devuelve todos los product
router.get('/home', isAuthenticated, readViewsProductsController);

// Devuelve todos los productos en tiempo real
router.get('/realtimeproducts', isAuthenticated, isAdmin, readViewsRealTimeProductsController);

// Devuelve un producto según su id
router.get('/realtimeproducts/:cid', isAuthenticated, readViewsProductController);

// Devuelve un carrito según su id
router.get('/carts', isAuthenticated, readViewsCartController);

// Devuelve el chat de usuario
router.get('/chat', readViewsChats);
export default router;
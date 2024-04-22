import { Router } from 'express';
import { 
  readCartsController, 
  readCartController, 
  createCartController, 
  addProductCartController, 
  updateProductsCartController,
  updateProductCartController,
  deleteProductCartController,
  deleteProductsCartController,
  purchaseCartController 
} from "../controllers/cart.controller.js";
import { __dirname } from "../utils.js";

const router = Router()

// Devuelve todos los carritos
router.get('/', readCartsController);

// Devuelve un carrito según su id
router.get('/:cid', readCartController);

// Crea un carrito
router.post('/', createCartController);

// Agrega un producto al carrito
router.post('/:cid/product/:pid', addProductCartController);

// Ruta para finalizar la compra de los productos agregados al carrito
router.get('/:cid/purchase', purchaseCartController);

// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
router.put('/:cid', updateProductsCartController);

// PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put('/:cid/products/:pid', updateProductCartController);

// Vacía el carrito
router.delete('/:cid', deleteProductsCartController);

// Elimina del carrito el producto seleccionado
router.delete('/:cid/products/:pid', deleteProductCartController);

export default router
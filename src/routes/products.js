import { Router } from 'express';

import { createProductController,
  readProductController,
  readAllProductsController,
  updateProductController,
  deleteProductController } from "../controllers/product.controller.js";

const router = Router();

// Ruta raíz GET /api/products - Listar todos los productos
router.get('/', readAllProductsController);

// Ruta GET /api/products/:pid - Traer sólo el producto con el id proporcionado
router.get('/:pid', readProductController);

// Ruta raíz POST /api/products - Agregar un nuevo producto
router.post('/', createProductController);

// Ruta PUT /api/products/:pid - Actualizar un producto
router.put('/:pid', updateProductController);

// Ruta DELETE /api/products/:pid - Eliminar un producto
router.delete('/:pid', deleteProductController);


export default router;
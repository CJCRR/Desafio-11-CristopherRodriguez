import cartModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';
import User from '../dao/models/user.model.js';
import { __dirname } from "../utils.js";
import ticketModel from '../dao/models/ticket.model.js'
import { ProductService } from '../services/index.js';
import logger from '../logger.js'

export const readCartsController = async (req, res) => {
    try {
        const carts = await cartModel.find().lean().exec();
        res.status(200).json(carts);
    } catch (error) {
      logger.error('Error al obtener los carritos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const readCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products.product').lean().exec();
    
        if (!cart) {
          res.status(404).json({ error: 'Carrito no encontrado' });
          return;
        }
        
        // Obtener la información completa de los productos utilizando el populate
        const productsWithInfo = await productsModel.populate(cart, {
          path: 'products.product',
          model: 'products',
        });
    
        res.status(200).json(productsWithInfo);
    
      } catch (error) {
        logger.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
      }
}

export const createCartController = async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
    
        res.status(201).json(newCart);
    } catch (error) {
      logger.error('Error al crear el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const addProductCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        console.log("🚀 ~ addProductCartController ~ req.params:", req.params)
        const productId = req.params.pid;
    
        // Obtén el usuario actual
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        
        //const product = await productsModel.findById(productId).lean().exec();
        const product = await ProductService.getById(productId)
    
        if (!product) {
          res.status(404).json({ error: 'Producto no encontrado' });
          return;
        }
    
        const cart = await cartModel.findById(cartId).lean().exec();
    
        if (!cart) {
          res.status(404).json({ error: 'Carrito no encontrado' });
          return;
        }
    
        const existingProductIndex = cart.products.findIndex(
          (item) => item.product.toString() === productId
        );
    
        if (existingProductIndex !== -1) {
          // Si el producto ya está en el carrito, incrementar la cantidad
          cart.products[existingProductIndex].quantity++;
        } else {
          // Si el producto no está en el carrito, agregarlo con cantidad 1
          cart.products.push({
            product: productId,
            quantity: 1
          });
        }
    
        await cartModel.findByIdAndUpdate(cartId, { products: cart.products }).exec();
    
        await user.save();
    
        res.status(201).json(cart);
      } catch (error) {
        logger.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
      }
}

export const updateProductsCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productsToUpdate = req.body;
  
        const cart = await cartModel.findById(cartId).lean().exec();
  
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
  
        await cartModel.findByIdAndUpdate(cartId, { products: productsToUpdate }).exec();
  
        res.status(200).json({ message: 'Carrito actualizado satisfactoriamente' });
    } catch (error) {
      logger.error('Error al actualizar el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const updateProductCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
  
        const cart = await cartModel.findById(cartId).lean().exec();
  
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
  
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId
        );
  
        if (existingProductIndex === -1) {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
            return;
        }
  
        const updatedProducts = [...cart.products];
        updatedProducts[existingProductIndex].quantity = quantity;
  
        await cartModel.findByIdAndUpdate(cartId, { products: updatedProducts }).exec();
  
        res.status(200).json({ message: 'Cantidad de producto actualizada satisfactoriamente' });
    } catch (error) {
      logger.error('Error al actualizar cantidad de producto en el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const deleteProductCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
    
        const cart = await cartModel.findById(cartId).lean().exec();
    
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
    
        // Filtrar los productos y eliminar el producto específico del carrito
        cart.products = cart.products.filter((item) => item.product.toString() !== productId);
    
        await cartModel.findByIdAndUpdate(cartId, { products: cart.products }).exec();
    
        res.status(200).json({ message: 'Producto eliminado del carrito satisfactoriamente' });
      } catch (error) {
        logger.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
      }
}

export const deleteProductsCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
    
        const cart = await cartModel.findById(cartId).lean().exec();
    
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
    
        // Vaciar el array de productos del carrito
        cart.products = [];
    
        await cartModel.findByIdAndUpdate(cartId, { products: cart.products }).exec();
    
        res.status(200).json({ message: 'Carrito vaciado satisfactoriamente' });
    } catch (error) {
      logger.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const purchaseCartController = async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Obtener el carrito
    const cart = await cartModel.findById(cartId).populate('products.product').lean().exec();

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

    let totalAmount = 0; 
    const purchasedProducts = []; 

    // Filtrar los productos que se pueden comprar y actualizar el monto total
    const unprocessedProducts = cart.products.filter(item => {
      const product = item.product;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity; 
        totalAmount += product.price * item.quantity; 
        purchasedProducts.push(item); 
        return false; // Producto comprado y procesado
      }

      return true; // Producto no procesado
    });

    if (purchasedProducts.length === 0) {
      res.status(400).json({ error: 'No se pudo procesar ninguna compra' });
      return;
    }

    // Actualizar los stocks de los productos comprados
    await Promise.all(purchasedProducts.map(async item => {
      const product = await productsModel.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }));

    // Crear un ticket con los datos de la compra
    const ticketData = {
      amount: totalAmount,
      purchaser: req.session.user.email,
    };

    const newTicket = await ticketModel.create(ticketData);

    // Actualizar el carrito del usuario con los productos no procesados
    const user = await User.findById(req.session.user._id).populate('cart').exec();
    if (user.cart) {
      user.cart.products = unprocessedProducts;
      await user.cart.save();
    }

    res.status(200).json({
      purchasedProducts,
      unprocessedProducts,
      ticket: newTicket
    });
  } catch (error) {
    logger.error('Error al finalizar la compra:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}
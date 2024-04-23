import { cartModel } from "../models/carts.model.js"
import  productsModel  from "../models/products.model.js"
import logger from "../../logger.js";

class CartManager {

    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean();
            return carts;
        } catch (err) {
            logger.error('Error al obtener los carritos:', err.message);
            return [];
        }
    };

    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId).populate('products._id').lean();
            if (cart.products && cart.products.length > 0) {
                cart.products = cart.products.map(product => {
                    return {
                        _id: product._id,
                        quantity: product.quantity,
                        ...product.product
                    };
                });
            }
            return cart;
        } catch (err) {
            logger.error('Error al obtener el carrito por ID:', err.message);
            return err;
        }
    }

    addCart = async (products) => {
        try {
            let cartData = {};
            if (products && products.length > 0) {
                cartData.products = products;
            }

            const cart = await cartModel.create(cartData);
            return cart;
        } catch (err) {
            logger.error('Error al crear el carrito:', err.message);
            return err;
        }
    };

    addProductInCart = async (cid, obj) => {
        try {
            const filter = { _id: cid, "products._id": obj._id };
            const cart = await cartModel.findById(cid);
            const findProduct = cart.products.some((product) => product._id.toString() === obj._id);

            if (findProduct) {
                const update = { $inc: { "products.$.quantity": obj.quantity } };
                await cartModel.updateOne(filter, update);
            } else {
                const update = { $push: { products: { _id: obj._id, quantity: obj.quantity } } };
                await cartModel.updateOne({ _id: cid }, update);
            }

            return await cartModel.findById(cid);
        } catch (err) {
            logger.error('Error al agregar el producto al carrito:', err.message);
            return err;
        }
    };

    deleteProductInCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true })

        } catch (err) {
            return err
        }

    }

    updateOneProduct = async (cid, products) => {

        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: false })
        }catch (err) {
            return err
        }
    }
};

export default CartManager;
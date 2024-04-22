import ProductDAO from "../dao/manager/products.dao.js";
import ProductRepository from "../repositories/product.repository.js";

export const ProductService = new ProductRepository(new ProductDAO());
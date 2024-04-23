import  productsModel  from "../models/products.model.js"
import logger from "../../logger.js"

export default class ProductDAO {
    getAll = async() => await productsModel.find().lean().exec()
    getById = async(id) => await productsModel.findById(id).lean().exec()
    getAllPaginate = async(req) => {
        try {
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const filterOptions = {}
        
            if (req.query.stock) filterOptions.stock = req.query.stock
            if (req.query.category) filterOptions.category = req.query.category
            const paginateOptions = { limit, page }
            if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
            if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }
            const result = await productsModel.paginate(filterOptions, paginateOptions)
            return {
                statusCode: 200,
                response: {
                    status: 'success',
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}` : null,
                    nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}` : null,
                }
            }
          } catch (error) {
            return {
                statusCode: 500,
                response: { status: 'error', error: error.message}
            }
            logger.error('Error al leer el archivo:', error);
            // res.status(500).json({ error: 'Error al leer el archivo' });
          }
    }
    create = async(data) => await productsModel.create(data)
    update = async(id, data) => await productsModel.findByIdAndUpdate(id, data, { new: true })
    delete = async(id) => await productsModel.findByIdAndDelete(id)
}
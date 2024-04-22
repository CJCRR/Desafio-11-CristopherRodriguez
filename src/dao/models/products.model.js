import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

//const productCollection = "products"
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String],
        default: []
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    }
})

mongoose.set('strictQuery', false)
productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model("products", productSchema)

export default productsModel
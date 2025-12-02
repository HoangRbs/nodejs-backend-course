const { clothingModel } = require('../../models/product.model')
const { Product } = require('./product')

class Clothing extends Product {
    async create() {
        const newProduct = await clothingModel.create(this)
        if(!newProduct) throw new BadRequestError('creating clothing product failed')

        return newProduct
    }
}

module.exports = { 
    Clothing 
}
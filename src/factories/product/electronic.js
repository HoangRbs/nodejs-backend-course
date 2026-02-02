const { electronicModel } = require('../../models/product.model')
const { Product } = require('./product')

class Electronics extends Product {
    async create() {
        const newProduct = await electronicModel.create(this)
        if(!newProduct) throw new BadRequestError('creating electronics product failed')

        return newProduct
    }
}

module.exports = {
    Electronics
}
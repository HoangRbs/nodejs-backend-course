const { electronicModel, clothingModel, productModel } = require('../models/product.model')
const { BadRequestError } = require('../core_response/error.response')

class ProductFactory {

    static createProduct_dict = {} // key-function dictionary

    static registerFunc_Dictionary (type, createProductFunc) {
        ProductFactory.createProduct_dict[type] = createProductFunc
    }

    static async createProduct(payload) {  // used in product controller
        const type = payload.product_type

        const createProductFunc = ProductFactory.createProduct_dict[type]
        if(!createProductFunc) throw new BadRequestError(`invalid product type ${type}`)

        return await createProductFunc(payload)

        // switch(type) {
        //     case 'Electronics': return await new Electronics(payload).createProduct()
        //     case 'Clothing' : return await new Clothing(payload).createProduct()
        //     default: throw new BadRequestError(`invalid product type ${type}`)
        // }
    }

    static async getDraftsForShop ({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await productModel.find(query)
            .populate('product_shop', 'name email -_id')
            .sort({ udpateAt: -1 })
            .skip()
            .lean()
            .exec()
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }

    async createProduct() {
        // in factory pattern this would be an interface, so no implementation
        // ... (still depend though)
    }
}

class Electronics extends Product {
    async createProduct() {
        const newProduct = await electronicModel.create(this)
        if(!newProduct) throw new BadRequestError('creating electronics product failed')

        return newProduct
    }
}

class Clothing extends Product {
    async createProduct() {
        const newProduct = await clothingModel.create(this)
        if(!newProduct) throw new BadRequestError('creating clothing product failed')

        return newProduct
    }
}

ProductFactory.registerFunc_Dictionary("Electronics", async (payload) => { return await new Electronics(payload).createProduct() })
ProductFactory.registerFunc_Dictionary("Clothing", async (payload) => { return await new Clothing(payload).createProduct() })

module.exports = {
    ProductService: ProductFactory
}







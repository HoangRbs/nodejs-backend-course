const { BadRequestError } = require('../../core_response/error.response')
const { Electronics } = require('./electronic')
const { Clothing } = require('./clothing')

class ProductFactory {

    // REGISTRY PATTERN: replace switch(type)
    // key-function dictionary (create new product obj according to key type)
    static createProductObj_dict = {} 

    static registerFunc_Dict (type, createProductObj_func) {
        ProductFactory.createProductObj_dict[type] = createProductObj_func
    }

    static async createProduct(payload) {  // used in product service
        const type = payload.product_type

        const createProductObj_func = ProductFactory.createProductObj_dict[type]
        if(!createProductObj_func) throw new BadRequestError(`invalid product type ${type}`)

        const newProductObj = createProductObj_func(payload)
        return await newProductObj.create()

        // -- the old way (Unmaintainable lol)
        // switch(type) {
        //     case 'Electronics': return await new Electronics(payload).createProduct()
        //     case 'Clothing' : return await new Clothing(payload).createProduct()
        //     default: throw new BadRequestError(`invalid product type ${type}`)
        // }
    }
}

// REGISTRY PATTERN: replace switch(type)
// key-function dictionary (create new product obj according to key type)
ProductFactory.registerFunc_Dict("Electronics", (payload) => { return new Electronics(payload) })
ProductFactory.registerFunc_Dict("Clothing", (payload) => { return new Clothing(payload) })

module.exports = {
    ProductFactory
}
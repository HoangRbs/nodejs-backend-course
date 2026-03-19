const { BadRequestError } = require('../../core_response/error.response')
const { Electronics } = require('./electronic')
const { Clothing } = require('./clothing')

class ProductFactory {

    // REGISTRY PATTERN: replace switch(type)
    // key-function dictionary (key - create new product obj FUNCTION)
    static createProductObj_dict = {} 

    static registerFunc_Dict (type, createProductObj_func) {
        ProductFactory.createProductObj_dict[type] = createProductObj_func
    }

    static async createProduct(payload) {  // used in product service
        const type = payload.product_type

        const createProductObj_func = ProductFactory.createProductObj_dict[type]
        if(!createProductObj_func) throw new BadRequestError(`invalid product type ${type}`)

        const newProductObj = createProductObj_func(payload)  // create new object through function
        return await newProductObj.create()

        // -- the old way (Unmaintainable lol)
        // switch(type) {
        //     case 'Electronics': return await new Electronics(payload).createProduct()
        //     case 'Clothing' : return await new Clothing(payload).createProduct()
        //     default: throw new BadRequestError(`invalid product type ${type}`)
        // }
    }

    // I think currently no need the update function for this Factory pattern,
    // just do all the logic straight inside the product.service.js
    // might later be benefitial if the update of "Clothing" or "Electronics" (different types)
    // are different from each other (from different attributes)
    /*
    static async updateProduct(payload) {
        const type = payload.product_type

        const createProductObj_func = ProductFactory.createProductObj_dict[type]
        if(!createProductObj_func) throw new BadRequestError(`invalid product type ${type}`)

        const newProductObj = createProductObj_func(payload)
        return await newProductObj.update()
    }
    */
}

// REGISTRY PATTERN: replace switch(type)
// key-function dictionary (create new product obj according to key type)
ProductFactory.registerFunc_Dict("Electronics", (payload) => { return new Electronics(payload) })
ProductFactory.registerFunc_Dict("Clothing", (payload) => { return new Clothing(payload) })

module.exports = {
    ProductFactory
}
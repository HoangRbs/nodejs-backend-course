const { electronicModel, clothingModel, productModel } = require('../models/product.model')
const { BadRequestError } = require('../core_response/error.response')
const { Types } = require('mongoose')
const { getSelectData, noGetSelectData } = require('../utils')

class ProductFactory {

    static createProduct_dict = {} // key-function dictionary (create product function)

    static registerFunc_Dictionary (type, createProductFunc) {
        ProductFactory.createProduct_dict[type] = createProductFunc
    }

    static async createProduct(payload) {  // used in product controller
        const type = payload.product_type

        const createProductFunc = ProductFactory.createProduct_dict[type]
        if(!createProductFunc) throw new BadRequestError(`invalid product type ${type}`)

        return await createProductFunc(payload)

        // -- the old way (Unmaintainable lol)
        // switch(type) {
        //     case 'Electronics': return await new Electronics(payload).createProduct()
        //     case 'Clothing' : return await new Clothing(payload).createProduct()
        //     default: throw new BadRequestError(`invalid product type ${type}`)
        // }
    }

    static async getDraftsForShop ({ product_shop, limit = 50, skip = 0 }) {
        
        const query = {product_shop, isDraft: true}
        return await queryProduct({query, limit, skip})
    }

    static async getPublishedForShop ({ product_shop, limit = 50, skip = 0 }) {
    
        const query = {product_shop, isPublished: true}
        return await queryProduct({query, limit, skip})
    }

    static async publishProductByShop ({product_shop, product_id}) {
        
        const foundProduct = await productModel.findOne({
            product_shop: new Types.ObjectId(`${product_shop}`), // cast number to string
            _id: new Types.ObjectId(`${product_id}`),
        })
    
        if (!foundProduct) return null

        foundProduct.isDraft = false
        foundProduct.isPublished = true
        
        // ohhhh not using productModel.findOneAndUpdate() ?? I see
        const {modifiedCount} = await foundProduct.save()
    
        // this "modified count" returns 1 if the foundProduct is updated successfully 
        return modifiedCount;
    }


    static async unPublishProductByShop ({product_shop, product_id}) {
        
        const foundProduct = await productModel.findOne({
            product_shop: new Types.ObjectId(`${product_shop}`), // cast number to string
            _id: new Types.ObjectId(`${product_id}`),
        })
    
        if (!foundProduct) return null

        foundProduct.isDraft = true
        foundProduct.isPublished = false
        
        // ohhhh not using productModel.findOneAndUpdate() ?? I see
        const {modifiedCount} = await foundProduct.save()
    
        // this "modified count" returns 1 if the foundProduct is updated successfully 
        return modifiedCount;
    }

    static async searchProducts ({ keySearch }) {
        // full text search
        const results = await productModel.find(
            {
                isPublished: true, 
                $text: { $search: keySearch } // full text search mode
            }, 
            { score: { $meta: "textScore" }} // use score mode
        )
        .sort({score: { $meta: "textScore" }}) // sort by score mode
        .lean()

        return results;
    } 

    // not really all products, maybe like first 50 products per page
    static async getAllProducts ({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {

        const select = getSelectData(['product_name', 'product_price', 'product_thumb', 'product_shop'])
        const skip = (page - 1) * limit // if page = 2 then skip the first 50 ...
        const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
        
        return await productModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(select)
            .lean();
    }

    // get product info
    static async getProduct({product_id}) {
        const select = noGetSelectData([ '__v' ]) // we don't want to get this field
        return await productModel.findOne({ 
            _id: product_id,
            isPublished: true
        }).select(select)
    }
}

const queryProduct = async({query, limit, skip}) => {
    return await productModel.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ udpateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
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

// key-function dictionary
ProductFactory.registerFunc_Dictionary("Electronics", async (payload) => { return await new Electronics(payload).createProduct() })
ProductFactory.registerFunc_Dictionary("Clothing", async (payload) => { return await new Clothing(payload).createProduct() })

module.exports = {
    ProductService: ProductFactory
}







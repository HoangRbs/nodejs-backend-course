const { productModel } = require('../models/product.model')
const { Types } = require('mongoose')
const { getSelectData, noGetSelectData, removeUndefinedObject, nestedObjectParser } = require('../utils')
const { ProductFactory } = require('../factories/product')

class ProductService {

    static async createProduct(payload) {  // used in product controller
        return await ProductFactory.createProduct(payload)
    }


    // call it "updatePayload" instead of "payload" cuz it's NOT a FULL PRODUCT INFORMATION
    // currently we make the update() function for all type of products (clothings, eletronics, ...)
    // will make a seperate versions for each product type later. (should be a better way cuz have more constraints)
    static async updateProduct(productId, updatePayload) {
        console.log('\n ----- original updatePayload: -------- \n', updatePayload)

        // 1. get rid of any "null" of "undefined" attribute before processing(dont trust front end) 
        removeUndefinedObject(updatePayload)

        console.log('\n ----- updatePayload after removeUndefinedObject: -------- \n', updatePayload)

        // if it has product_atrributes { ... } means we updating NESTED DATA
        if (updatePayload.product_attributes) {
            // get rid of null value in the attributes
            removeUndefinedObject(updatePayload.product_attributes)

            // for updating nested data in mongoDB 
            // without losing the other properties of product_attributes
          
            // (new)updatePayload = {
            //      product_name: 'iphone 14 pro max edited',
            //      .....
            //     'product_attributes.manufacturer': 'chau tinh tri edited 2'
            // }

            updatePayload = nestedObjectParser(updatePayload)
            console.log('\n ----- updatePayload after nestedObjectParser: -------- \n', updatePayload)
        } 
        
        return await productModel.findByIdAndUpdate(productId, updatePayload, {
            strict: false, // allow update with any fields through discriminator 
            // even those not in the product schema
            // we do this temprarily, will later make update for each product model type
            new: true
        }) 
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

module.exports = {
    ProductService
}







const { Ok } = require('../core_response/success.response');
const { ProductService } = require('../services/product.service')

class ProductController {

    createProduct = async(req, res, next) => {
        new Ok(
            res,
            'create new product success',
            await ProductService.createProduct({
                ...req.body,
                product_shop: req.user.userId // security purpose (authentication)
            })
        )        
    }

     /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return { JSON }
     */
    getDraftsForShop = async (req, res, next) => {
        new Ok(
            res, 
            'Find list drafts success',
            await ProductService.getDraftsForShop({
               product_shop: req.user.userId
            })
        )
    }

    /**
     * @desc Get all publishes for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return { JSON }
     */
    getPublishedForShop = async (req, res, next) => {
        new Ok(
            res, 
            'Find list publishes success',
            await ProductService.getPublishedForShop({
               product_shop: req.user.userId
            })
        )
    }

    publishProductByShop = async (req, res, next) => {
        new Ok(
            res, 
            "Update publish product success",
            await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        )
    }

    unPublishProductByShop = async (req, res, next) => {
        new Ok(
            res, 
            "Update unPublish product success",
            await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        )
    }

    searchProducts = async (req, res, next) => {
        new Ok(
            res, 
            "get list search success",
            await ProductService.searchProducts(req.params)
        )
    }


    getAllProducts = async (req, res, next) => {
        new Ok(
            res, 
            "get list success",
            await ProductService.getAllProducts(req.query)
        )
    }

    getProduct = async (req, res, next) => {
        new Ok(
            res, 
            "get product info success",
            await ProductService.getProduct(req.params)
        )
    }
}

module.exports = new ProductController()
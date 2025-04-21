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
}

module.exports = new ProductController()
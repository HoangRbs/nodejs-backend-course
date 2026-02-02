const shopModel = require("../models/shop.model")


class ShopService {
    static findByEmail = async (email) => {

        const select = {
            email: 1, password: 2, status: 3, roles: 4, name: 5
        }

        return await shopModel.findOne({email}).select(select).lean();
    }
}

module.exports = ShopService
const { genRandomStringAsync } = require("../helpers/genRandomStringAsync");
const apiKeyModel = require("../models/apiKey.model")

class ApiKeyService {
    static findKey = async (key) => {
        return await apiKeyModel.findOne({key, status: true}).lean();
    } 

    static createApiKey = async() => {
        const key = await genRandomStringAsync()
        await apiKeyModel.create({key, status: true, permissions: ['0000']})
        return key;
    }
}

module.exports = ApiKeyService
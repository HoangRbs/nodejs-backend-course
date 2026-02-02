const mongoose = require("mongoose");

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    accessTokenSecretKey: {
        type: String,
        required: true
    },
    refreshTokenSecretKey: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: true
    },

    // for security: saves all the used token while user is logging in
    // if an attacker uses one of these token --> block him
    // because the main user always use the newest refresh token 
    refreshTokensUsed: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema)
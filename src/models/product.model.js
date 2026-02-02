const {Schema, mongoose} = require("mongoose");
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';


const productSchema = new mongoose.Schema({
    product_name: {  // doat mang 3000
        type: String,
        trim: true,
        maxLength: 150
    },
    product_slug: String, // doat-mang-3000
    product_thumb: {
        type: String,
        trim: true
    },
    product_description: {
        type: String,
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ["Electronics", "Clothing", "Furniture"]
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { // a phone can have many colors, many storage size
        type: Array,
        default: [],
    },
    isDraft: {
        type: Boolean,
        default: true, // whenever we create a product, it will always be a draft
        index: true, // we assign "index" for this field, when using "find({ isDraft: true })" --> helps optimize searching time
        select: false // khong lay field nay ra khi "find", "findOne"
    },
    isPublished: {
        type: Boolean,
        default: false, 
        index: true,
        select: false // khong lay field nay ra khi "find", "find One"
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// create (compound) index for full text search
productSchema.index({
    product_name: 'text',
    product_description: 'text'
})

// document middleware: run before .save() and .create()
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

const electronicSchema = new Schema({
    product_attributes: {
        manufacturer: { type: String, required: true},
        model: String,
        color: String,
    }
})

const clothingSchema = new Schema({
    product_attributes: {
        brand: { type: String, required: true},
        size: String,
        material: String,
    }
})

const productModel = mongoose.model(DOCUMENT_NAME, productSchema)

module.exports = {
    productModel,
    electronicModel: productModel.discriminator('Electronics', electronicSchema),
    clothingModel: productModel.discriminator('Clothing', clothingSchema)
}
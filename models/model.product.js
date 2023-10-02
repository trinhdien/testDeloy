const database = require("./database");
const productSchema = database.mongoose.Schema({
    category: {
        type: database.mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    title: {type: String, required: true},
    description: {type: String, required: true},
    imgCover: {type: String, required: true},
    color: {type: String, required: true},
    price: {type: String, required: true},
    quantity: {type: String, required: true},
    sold: {type: String, required: true},
    listImgDes: [{type: String, required: true}],
    videoDes: {type: String, required: true},
    date: {type: String, required: true},
}, {
    collection: "Product"
});
const productModel = database.mongoose.model("product", productSchema);
module.exports = {productModel};
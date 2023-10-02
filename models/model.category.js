const database = require('./database');
const fs = require("fs");
const path = require("path");
const {randomUUID} = require("crypto");
const categorySchema = database.mongoose.Schema({
        title: {type: String, required: true},
        img: {type: String, required: true},
        date: {type: String, required: true},
    },
    {
        collection: "Category"
    }
);
const categoryModel = database.mongoose.model("category", categorySchema);
module.exports = {categoryModel};
const ProductModel = require("../models/model.product");
const fs = require("fs");
const path = require("path");
const CategoryModel = require("../models/model.category");
const UploadFile = require("../models/uploadFile");
const matchImg = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/jp2",
    "image/heif"
];
const matchVideo = [
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/webm",
    "video/3gpp",
    "video/ogg",
    "video/mpeg"
];
exports.addProduct = async (req, res) => {
    let category = req.body.category;
    let title = req.body.title;
    let description = req.body.description;
    let fileImgCover = req.files["imgCover"];
    let fileListImgDes = req.files["listImgDes"];
    let fileVideoDes = req.files["videoDes"];
    let color = req.body.color;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let sold = req.body.sold;
    let date = req.body.date;
    if (category == null) {
        return res.send({message: "category is required", code: 0});
    }
    if (title == null) {
        return res.send({message: "title is required", code: 0});
    }
    if (description == null) {
        return res.send({message: "description is required", code: 0});
    }
    if (fileImgCover === undefined) {
        return res.send({message: "img cover is required", code: 0});
    }
    if (fileListImgDes === undefined) {
        return res.send({message: "img des is required", code: 0});
    }
    if (fileVideoDes === undefined) {
        return res.send({message: "video des is required", code: 0});
    }
    if (color == null) {
        return res.send({message: "color is required", code: 0});
    }
    if (price == null) {
        return res.send({message: "price is required", code: 0});
    }
    if (quantity == null) {
        return res.send({message: "quantity is required", code: 0});
    }
    if (sold == null) {
        return res.send({message: "sold is required", code: 0});
    }
    if (date == null) {
        return res.send({message: "date is required", code: 0});
    }
    let isFormat = true;
    console.log({fileImgCover: fileImgCover, fileListImgDes: fileListImgDes, fileVideoDes: fileVideoDes});
    fileListImgDes.map(item => {
        if (matchImg.indexOf(item.mimetype) === -1) {
            isFormat = false;
        }
    });
    if (matchImg.indexOf(fileImgCover[0].mimetype) === -1) {
        isFormat = false;
    }
    if (matchVideo.indexOf(fileVideoDes[0].mimetype) === -1) {
        isFormat = false;
    }
    if (isFormat === false) {
        return res.send({message: "The uploaded file is not in the correct format", code: 0});
    }
    let product = new ProductModel.productModel({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        color: req.body.color,
        price: req.body.price,
        quantity: req.body.quantity,
        sold: req.body.sold,
        date: req.body.date,
    })
    try {
        let imgCover = await UploadFile.uploadFile(req, product._id.toString(), "product", fileImgCover[0], ".jpg");
        if (imgCover === 0) {
            return res.send({message: "upload file fail", code: 0});
        }
        let videoDes = await UploadFile.uploadFile(req, product._id.toString(), "product", fileVideoDes[0], ".mp4");
        if (videoDes === 0) {
            return res.send({message: "upload file fail", code: 0});
        }
        let listImgDes = await UploadFile.uploadFiles(req, product._id.toString(), "product", fileListImgDes, ".jpg");
        if (listImgDes === 0) {
            return res.send({message: "upload file fail", code: 0});
        }
        product.imgCover = imgCover;
        product.listImgDes = listImgDes;
        product.videoDes = videoDes;
        await product.save();
        return res.send({message: "add product success", code: 1});
    } catch (e) {
        console.log(e);
        return res.send({message: "add product fail", code: 0});
    }
}
exports.getListProduct = async (req, res) => {
    try {
        let listProduct = await ProductModel.productModel.find().populate("category");
        res.send({product: listProduct, message: "get list product success", code: 1})
    } catch (e) {
        console.log(e.message);
        return res.send({message: "get list product fail", code: 0});
    }
}
exports.deleteProduct = async (req, res) => {
    let productId = req.body.productId;
    if (productId == null) {
        return res.send({message: "product not found", code: 0});
    }
    try {
        let product = await ProductModel.productModel.findById(productId);
        if (!product) {
            return res.send({message: "product not found", code: 0});
        }
        let listImgDes = product.listImgDes;
        let imgCover = product.imgCover;
        let videoDes = product.videoDes;
        listImgDes.push(imgCover, videoDes);
        let pathFolderDelete = imgCover.split("/")[5];
        let isRemove = true;
        listImgDes.map((item) => {
            fs.unlink(path.join(__dirname, "../public" + item.split("3000")[1]), (err) => {
                if (err) {
                    isRemove = false;
                }
            });
        })
        if (isRemove === false) {
            return res.send({message: "delete product fail", code: 0});
        }
        fs.rmdir(path.join(__dirname, "../public/images/product/" + pathFolderDelete), async (err) => {
            if (err) {
                console.log(err.message);
            } else {
                await ProductModel.productModel.deleteOne({_id: productId});
                return res.send({message: "Delete product success", code: 1});
            }
        });
    } catch (e) {
        console.log(e);
        return res.send({message: "product not found", code: 0});
    }
}
exports.editProduct = async (req, res) => {
    let productId = req.body.productId;
    let category = req.body.category;
    let title = req.body.title;
    let description = req.body.description;
    let color = req.body.color;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let sold = req.body.sold;
    let date = req.body.date;
    let fileImgCover = req.files["imgCover"];
    let fileListImgDes = req.files["listImgDes"];
    let fileVideoDes = req.files["videoDes"];
    if (productId == null) {
        return res.send({message: "product not found", code: 0});
    }
    try {
        let product = await ProductModel.productModel.findById(productId);
        if (!product) {
            return res.send({message: "product not found", code: 0});
        }
        if (category !== undefined) {
            console.log(product.category);
            product.category = category;
        }
        if (title !== undefined) {
            product.title = title;
        }
        if (description !== undefined) {
            product.description = description;
        }
        if (color !== undefined) {
            product.color = color;
        }
        if (price !== undefined) {
            product.price = price;
        }
        if (quantity !== undefined) {
            product.quantity = quantity;
        }
        if (sold !== undefined) {
            product.sold = sold;
        }
        if (date !== undefined) {
            product.date = date;
        }
        if (fileImgCover !== undefined) {
            if (matchImg.indexOf(fileImgCover[0].mimetype) === -1) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            UploadFile.deleteFile(res, product.imgCover.split("3000")[1]);
            let imgCover = await UploadFile.uploadFile(req, product._id.toString(), "product", fileImgCover[0], ".jpg");
            if (imgCover === 0) {
                return res.send({message: "upload file fail", code: 0});
            }
            product.imgCover = imgCover;
        }
        if (fileListImgDes !== undefined) {
            let isFormat = true;
            fileListImgDes.map(item => {
                if (matchImg.indexOf(item.mimetype) === -1) {
                    isFormat = false;
                }
            });
            if (isFormat === false) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            product.listImgDes.map((item) => {
                UploadFile.deleteFile(res, item.split("3000")[1]);
            })
            let listImgDes = await UploadFile.uploadFiles(req, product._id.toString(), "product", fileListImgDes, ".jpg");
            if (listImgDes === 0) {
                return res.send({message: "upload file fail", code: 0});
            }
            product.listImgDes = listImgDes;
        }
        if (fileVideoDes !== undefined) {
            if (matchImg.indexOf(fileVideoDes[0].mimetype) === -1) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            UploadFile.deleteFile(res, product.videoDes.split("3000")[1]);
            let videoDes = await UploadFile.uploadFile(req, product._id.toString(), "product", fileVideoDes[0], ".mp4");
            if (videoDes === 0) {
                return res.send({message: "upload file fail", code: 0});
            }
            product.videoDes = videoDes;
        }
        return res.send({message: "Edit product success", code: 1});
    } catch (e) {
        console.log(e);
        return res.send({message: "Edit product fail", code: 0});
    }
}
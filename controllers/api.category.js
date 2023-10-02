const CategoryModel = require("../models/model.category");
const UploadFile = require("../models/uploadFile");
const fs = require("fs");
const path = require("path");
const match = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/jp2",
    "image/heif"];
exports.addCategory = async (req, res) => {
    let title = req.body.title;
    let file = req.file;
    let date = req.body.date;
    if (title == null) {
        return res.send({message: "title is required", code: 0});
    }
    if (file == null) {
        return res.send({message: "img is required", code: 0});
    }
    if (match.indexOf(file.mimetype) === -1) {
        return res.send({message: "The uploaded file is not in the correct format", code: 0});
    }
    if (date == null) {
        return res.send({message: "date is required", code: 0});
    }
    try {
        let category = new CategoryModel.categoryModel({
            title: title,
            date: date,
        })
        let statusCode = await UploadFile.uploadFile(req, category._id.toString(), "category", file, ".jpg");
        if (statusCode === 0) {
            return res.send({message: "Upload file fail", code: 0});
        } else {
            category.img = statusCode;
            await category.save();
            return res.send({message: "add category success", code: 1});
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "Add category fail", code: 0})
    }
};

exports.editCategory = async (req, res) => {
    let file = req.file;
    let date = req.body.date;
    let title = req.body.title;
    let categoryId = req.body.categoryId;
    if (categoryId == null) {
        return res.send({message: "category not found", code: 0});
    }
    try {
        let category = await CategoryModel.categoryModel.findById(categoryId);
        if (!category) {
            return res.send({message: "category not found", code: 0});
        }
        if (title != null) {
            category.title = title;
        }
        if (date != null) {
            category.date = date;
        }
        if (file != null) {
            if (match.indexOf(file.mimetype) === -1) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            const pathImgDelete = category.img.split("3000");
            UploadFile.deleteFile(res, pathImgDelete[1]);
            let statusCode = await UploadFile.uploadFile(req, category._id.toString(), "category", file, ".jpg");
            if (statusCode === 0) {
                return res.send({message: "Upload file fail", code: 0});
            } else {
                category.img = statusCode;
            }
        }
        await category.save();
        return res.send({message: "Edit category success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "category not found", code: 0});
    }
};
exports.deleteCategory = async (req, res) => {
    let categoryId = req.body.categoryId;
    if (categoryId == null) {
        return res.send({message: "category not found", code: 0});

    }
    try {
        let category = await CategoryModel.categoryModel.findById(categoryId);
        if (!category) {
            return res.send({message: "category not found"});
        }
        const pathFolderDelete = category.img.split("/")[5];
        const pathImgDelete = category.img.split("3000")[1];
        fs.unlink(path.join(__dirname, "../public" + pathImgDelete), (err) => {
            if (err) {
                console.log(err);
            } else {
                fs.rmdir(path.join(__dirname, "../public/images/category/" + pathFolderDelete), async (err) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        await CategoryModel.categoryModel.deleteOne({_id: categoryId});
                        return res.send({message: "Delete category success", code: 1});
                    }
                });
            }
        })
    } catch (e) {
        console.log(e.message);
        return res.send({message: "delete category fail", code: 0});
    }
}
exports.getListCategory = async (req, res) => {
    try {
        let listCategory = await CategoryModel.categoryModel.find();
        return res.send({category: listCategory, message: "get list category success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "category not found", code: 0})
    }
}
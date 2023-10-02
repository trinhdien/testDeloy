const UserModel = require("../models/model.user");
const UploadFile = require("../models/uploadFile");
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
exports.addUser = async (req, res) => {
    let file = req.file;
    let password = req.body.password;
    let fullName = req.body.fullName;
    let phoneNumber = req.body.phoneNumber;
    let role = req.body.role;
    let address = req.body.address;
    let email = req.body.email;
    let avatar;
    if (password == null) {
        return res.send({message: "Password is required", code: 0});
    }
    if (fullName == null) {
        return res.send({message: "Full name is required", code: 0});
    }
    if (phoneNumber == null) {
        return res.send({message: "Phone number is required", code: 0});
    }
    if (role == null) {
        return res.send({message: "role is required", code: 0});
    }
    if (email == null) {
        return res.send({message: "Email is required", code: 0});
    }
    try {
        let userPhone = await UserModel.userModel.findOne({phoneNumber: phoneNumber});
        let userEmail = await UserModel.userModel.findOne({email: email});
        if (userPhone) {
            return res.send({message: "phone number already exists", code: 0});
        }
        if (userEmail) {
            return res.send({message: "email already exists", code: 0});
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "register user fail"});
    }
    if (file == null) {
        try {
            let user = new UserModel.userModel({
                password: password,
                fullName: fullName,
                phoneNumber: phoneNumber,
                role: role,
                email: email,
            });
            await user.save();
            return res.send({message: "Register user success", code: 1});
        } catch (e) {
            console.log(e.message);
            return res.send({message: "Add user fail", code: 0})
        }
    } else {
        if (match.indexOf(file.mimetype) === -1) {
            return res.send({message: "The uploaded file is not in the correct format", code: 0});
        }
        try {
            let user = new UserModel.userModel({
                password: password,
                fullName: fullName,
                phoneNumber: phoneNumber,
                role: role,
                email: email,
            });
            let statusCode = await UploadFile.uploadFile(req, user._id.toString(), "user", file, ".jpg");
            if (statusCode === 0) {
                return res.send({message: "Upload file fail", code: 0});
            } else {
                user.avatar = statusCode;
                await user.save();
                return res.send({message: "Register user success", code: 1});
            }
        } catch (e) {
            console.log(e.message);
            return res.send({message: "Add user fail", code: 0})
        }
    }
}
exports.editUser = async (req, res) => {
    let file = req.file;
    let password = req.body.password;
    let fullName = req.body.fullName;
    let phoneNumber = req.body.phoneNumber;
    let role = req.body.role;
    let address = req.body.address;
    let email = req.body.email;
    if (req.body.userId == null) {
        return res.send({message: "User not found", code: 0});
    }
    try {
        let user = await UserModel.userModel.findById(req.body.userId);
        if (user == null) {
            return res.send({message: "User not found", code: 0});
        }
        if (password != null) {
            user.password = password;
        }
        if (fullName != null) {
            user.fullName = fullName;
        }
        if (phoneNumber != null) {
            user.phoneNumber = phoneNumber;
        }
        if (role != null) {
            user.role = role;
        }
        if (address != null) {
            user.adress = address;
        }
        if (email != null) {
            user.email = email;
        }
        if (file != null) {
            if (match.indexOf(file.mimetype) === -1) {
                return res.send({message: "The uploaded file is not in the correct format", code: 0});
            }
            const pathImgDelete = user.avatar.split("3000");
            UploadFile.deleteFile(res, pathImgDelete[1]);
            let statusCode = await UploadFile.uploadFile(req, user._id.toString(), "user", file, ".jpg");
            if (statusCode === 0) {
                return res.send({message: "Upload file fail", code: 0});
            } else {
                user.avatar = statusCode;
            }
        }
        await user.save();
        return res.send({message: "Edit user success", code: 1});
    } catch (e) {
        console.log(e.message);
        return res.send({message: "User not found", code: 0});
    }
}
exports.loginUser = (req, res) => {
    return res.send({user: req.user, message: "Login success", code: 1});
}


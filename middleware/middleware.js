const UserModel = require("../models/model.user")
exports.validateUser = async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password
    if (!username) {
        return res.send({message: "user name is required", code: 0});
    }
    if (!password) {
        return res.send({message: "password is required", code: 0});
    }
    try {
        let userEmail = await UserModel.userModel.findOne({email: username, password: password});
        let userPhone = await UserModel.userModel.findOne({phoneNumber: username, password: password});
        if (!userEmail && !userPhone) {
            return res.send({message: "Login fail please check your username and password", code: 0})
        }
        if (userPhone) {
            req.user = userPhone;
            next();
        }
        if (userEmail) {
            req.user = userEmail;
            next();
        }
    } catch (e) {
        console.log(e.message);
        return res.send({message: "user not found", code: 0})
    }
}
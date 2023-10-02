const db = require("./database");
const avatar = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg";

const userSchema = db.mongoose.Schema(
    {
        avatar: {type: String, default: avatar},
        email: {type: String, required: true},
        password: {type: String, required: true},
        fullName: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        role: {type: String, required: true},
        address: {type: String, required: false}
    },
    {
        collection: "User",
    }
);
const userModel = db.mongoose.model("user", userSchema);
module.exports = {userModel};
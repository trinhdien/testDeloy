const express = require('express');
const router = express.Router();
const Middleware = require("../middleware/middleware");
const ApiUserController = require("../controllers/api.user");
const ApiCategory = require("../controllers/api.category");
const ApiProduct = require("../controllers/api.product");
const multer = require("multer");
const upload = multer({dest: "uploads/"});
/* GET users listing. */
router.post('/registerUser', upload.single('file'), ApiUserController.addUser);
router.post('/editUser', upload.single('file'), ApiUserController.editUser);
router.post('/loginUser', Middleware.validateUser, ApiUserController.loginUser);
router.post('/loginUser', Middleware.validateUser, ApiUserController.loginUser);
router.post('/addCategory', upload.single('file'), ApiCategory.addCategory);
router.post('/editCategory', upload.single('file'), ApiCategory.editCategory);
router.post('/deleteCategory', ApiCategory.deleteCategory);
router.post('/getListCategory', ApiCategory.getListCategory);
router.post('/addProduct', upload.fields([{name:"imgCover",maxCount: 1},{name:"listImgDes",maxCount: 10},{name:"videoDes",maxCount: 1}]), ApiProduct.addProduct);
router.post('/getListProduct', ApiProduct.getListProduct);
router.post('/deleteProduct', ApiProduct.deleteProduct);
router.post('/editProduct', upload.fields([{name:"imgCover",maxCount: 1},{name:"listImgDes",maxCount: 10},{name:"videoDes",maxCount: 1}]),ApiProduct.editProduct);
module.exports = router;

const express = require("express")
const userController = require("../controller/userController")

const router = express.Router();

router.route("/register").get(userController.register);





module.exports = router;

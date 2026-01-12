const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

module.exports = router;

module.exports = router;

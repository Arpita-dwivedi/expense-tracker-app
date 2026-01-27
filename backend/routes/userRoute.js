const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

router.get("/me", auth, UserController.getMe);

module.exports = router;

module.exports = router;

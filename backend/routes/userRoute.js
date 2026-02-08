const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

router.post("/forgot-password", UserController.forgotPassword);

router.post("/reset-password", UserController.resetPassword);

router.get("/me", auth, UserController.getMe);

module.exports = router;

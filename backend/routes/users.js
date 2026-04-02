const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation");

const {
  registerSchema,
  loginSchema,
  updateSchema,
} = require("../middlewares/validation");

router.post("/", validation(registerSchema), usersController.register);
router.post("/login", validation(loginSchema), usersController.login);
router.get("/", auth, usersController.getAllUsers);
router.get("/:id", auth, usersController.getUserById);
router.put("/:id", auth, validation(updateSchema), usersController.updateUser);
router.delete("/:id", auth, usersController.deleteUser);

module.exports = router;

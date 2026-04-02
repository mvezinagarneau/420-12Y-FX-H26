const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  validation,
  registerSchema,
  loginSchema,
  updateSchema,
  passwordUpdateSchema,
} = require("../middlewares/validation");

router.post("/", validation(registerSchema), usersController.register);
router.post("/login", validation(loginSchema), usersController.login);
router.get("/profile", auth, usersController.getProfile);
router.put(
  "/profile",
  auth,
  validation(updateSchema),
  usersController.updateProfile,
);
router.put(
  "/profile/password",
  auth,
  validation(passwordUpdateSchema),
  usersController.updatePassword,
);
router.get("/", auth, admin, usersController.getAllUsers);
router.get("/check-email", usersController.checkEmailExists);
router.get("/:id", auth, admin, usersController.getUserById);
router.put(
  "/:id",
  auth,
  admin,
  validation(updateSchema),
  usersController.updateUser,
);
router.patch("/:id/active", auth, admin, usersController.toggleActive);
router.delete("/:id", auth, admin, usersController.deleteUser);

module.exports = router;

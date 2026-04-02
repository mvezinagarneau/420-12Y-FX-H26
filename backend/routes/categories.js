const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.get("/", auth, categoriesController.getAllCategories);
router.post("/", auth, admin, categoriesController.createCategory);
router.put("/:id", auth, admin, categoriesController.updateCategory);
router.delete("/:id", auth, admin, categoriesController.deleteCategory);

module.exports = router;

const Category = require("../models/Category");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      attributes: ["id", "name", "description"],
    });
    res.json({
      status: 200,
      message: "Catégories récupérées avec succès.",
      data: categories,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    // Check for duplicate name among active categories
    const existingCategory = await Category.findOne({
      where: { name, active: true },
    });
    if (existingCategory) {
      return res.status(409).json({
        status: 409,
        error: "Conflict",
        message: "Le nom de la catégorie existe déjà.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    const category = await Category.create({ name, description });
    res.status(201).json({
      status: 201,
      message: "Catégorie créée avec succès.",
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: 409,
        error: "Conflict",
        message: "Le nom de la catégorie existe déjà.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Catégorie non trouvée.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    // Check for duplicate name among active categories, excluding current
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { name, active: true },
      });
      if (existingCategory) {
        return res.status(409).json({
          status: 409,
          error: "Conflict",
          message: "Le nom de la catégorie existe déjà.",
          path: req.path,
          timestamp: new Date().toISOString(),
        });
      }
    }
    await category.update({ name, description, active });
    res.json({
      status: 200,
      message: "Catégorie mise à jour avec succès.",
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        active: category.active,
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Catégorie non trouvée.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    await category.update({ active: false });
    res.json({
      status: 200,
      message: "Catégorie archivée avec succès.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

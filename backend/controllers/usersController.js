const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { nom, courriel, motDePasse } = req.body;
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const user = await User.create({
      nom,
      courriel,
      motDePasse: hashedPassword,
    });
    res.status(201).json({
      status: 201,
      message: "Utilisateur créé avec succès.",
      data: {
        id: user.id,
        nom: user.nom,
        courriel: user.courriel,
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { courriel, motDePasse } = req.body;
    const user = await User.findOne({ where: { courriel } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Utilisateur non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized",
        message: "Mot de passe incorrect.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      status: 200,
      message: "Connexion réussie.",
      data: {
        token,
        user: {
          id: user.id,
          nom: user.nom,
          courriel: user.courriel,
        },
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ["id", "nom", "courriel"] });
    res.json({
      status: 200,
      message: "Utilisateurs récupérés avec succès.",
      data: users,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "nom", "courriel"],
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Utilisateur non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    res.json({
      status: 200,
      message: "Utilisateur récupéré avec succès.",
      data: user,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom, courriel } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Utilisateur non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    await user.update({ nom, courriel });
    res.json({
      status: 200,
      message: "Utilisateur mis à jour avec succès.",
      data: {
        id: user.id,
        nom: user.nom,
        courriel: user.courriel,
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Utilisateur non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    await user.destroy();
    res.json({
      status: 200,
      message: "Utilisateur supprimé avec succès.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

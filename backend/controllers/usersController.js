const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { lastName, firstName, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      lastName,
      firstName,
      email,
      password: hashedPassword,
      phone,
      role: "client",
      active: true,
    });
    res.status(201).json({
      status: 201,
      message: "Utilisateur créé avec succès.",
      data: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: 409,
        error: "Conflict",
        message: "Courriel déjà utilisé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: "Not Found",
        message: "Utilisateur non trouvé.",
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
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
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({
      status: 200,
      message: "Profil récupéré avec succès.",
      data: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { lastName, firstName, email, phone } = req.body;
    await user.update({ lastName, firstName, email, phone });
    res.json({
      status: 200,
      message: "Profil mis à jour avec succès.",
      data: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
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
    const { lastName, firstName, email, phone, role, active } = req.body;
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
    await user.update({ lastName, firstName, email, phone, role, active });
    res.json({
      status: 200,
      message: "Utilisateur mis à jour avec succès.",
      data: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
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
    const users = await User.findAll({
      attributes: [
        "id",
        "lastName",
        "firstName",
        "email",
        "phone",
        "role",
        "active",
      ],
    });
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
      attributes: [
        "id",
        "lastName",
        "firstName",
        "email",
        "phone",
        "role",
        "active",
      ],
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
    await user.update({ active: false });
    res.json({
      status: 200,
      message: "Utilisateur archivé avec succès.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

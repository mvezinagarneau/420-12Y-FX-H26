const User = require("../models/User");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const admin = async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  if (!user || user.role !== "admin") {
    return res
      .status(403)
      .json({ status: 403, error: "Forbidden", message: "Accès refusé" });
  }
  req.user = user;
  next();
};

module.exports = asyncHandler(admin);

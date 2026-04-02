const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({
      status: 401,
      error: "Unauthorized",
      message: "Token manquant.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      error: "Unauthorized",
      message: "Token invalide.",
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  }
};

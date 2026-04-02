module.exports = (error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    status: 500,
    error: "Internal Server Error",
    message: "Erreur interne du serveur.",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
};

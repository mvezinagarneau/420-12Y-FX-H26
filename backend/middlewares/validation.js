const Joi = require("joi");

const registerSchema = Joi.object({
  nom: Joi.string().required(),
  courriel: Joi.string().email().required(),
  motDePasse: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  courriel: Joi.string().email().required(),
  motDePasse: Joi.string().required(),
});

const updateSchema = Joi.object({
  nom: Joi.string().optional(),
  courriel: Joi.string().email().optional(),
}).min(1);

module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({
        status: 422,
        error: "Unprocessable Entity",
        message: error.details[0].message,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
module.exports.updateSchema = updateSchema;

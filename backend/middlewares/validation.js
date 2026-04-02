const Joi = require("joi");

const registerSchema = Joi.object({
  lastName: Joi.string().min(2).max(50).trim().required(),
  firstName: Joi.string().min(2).max(50).trim().required(),
  email: Joi.string().email().max(50).trim().required(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*\-]).*$/)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .trim()
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
});

const updateSchema = Joi.object({
  lastName: Joi.string().min(2).max(50).trim().optional(),
  firstName: Joi.string().min(2).max(50).trim().optional(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .trim()
    .optional(),
}).min(1);

module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const isRequired = error.details[0].type === "any.required";
      const status = isRequired ? 400 : 422;
      const errorType = isRequired ? "Bad Request" : "Unprocessable Entity";
      return res.status(status).json({
        status,
        error: errorType,
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

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
  role: Joi.string().valid("client", "technicien", "admin").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
});

const updateSchema = Joi.object({
  lastName: Joi.string().min(2).max(50).trim().optional(),
  firstName: Joi.string().min(2).max(50).trim().optional(),
  email: Joi.string().email().max(50).trim().optional(),
  phone: Joi.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .trim()
    .optional(),
  role: Joi.string().valid("client", "technicien", "admin").optional(),
  active: Joi.boolean().optional(),
}).min(1);

const passwordUpdateSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$ %^&*\-]).*$/)
    .required(),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

const ticketSchema = Joi.object({
  title: Joi.string().min(5).max(255).trim().required(),
  description: Joi.string().min(10).trim().required(),
  priority: Joi.string()
    .valid("Basse", "Moyenne", "Haute", "Critique")
    .optional(),
  categoryId: Joi.number().integer().required(),
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).trim().required(),
  type: Joi.string().valid("public", "internal").optional(),
});

module.exports = {
  validation: (schema) => {
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
  },
  registerSchema,
  loginSchema,
  updateSchema,
  passwordUpdateSchema,
  ticketSchema,
  commentSchema,
};

module.exports.registerSchema = registerSchema;
module.exports.loginSchema = loginSchema;
module.exports.updateSchema = updateSchema;

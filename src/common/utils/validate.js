export const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.json({ message: "validation error", error: error.details });
    }
    next();
  };
};

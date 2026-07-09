export const errorHandler = (error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Ocurrio un error interno en el cliente.'
  });
};

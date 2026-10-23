export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500
    ? 'Ocurrio un error interno. Intenta nuevamente.'
    : error.message;

  res.status(statusCode).json({
    success: false,
    message
  });
};

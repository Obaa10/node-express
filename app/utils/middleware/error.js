export default (err, req, res, next) => {
  if (typeof err === "string")
    err = { statusCode: 500, status: "fail", message: err };
  if (err.message === "Invalid token") err.statusCode = 401;

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
  }
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message?.replace(/\u001b\[\d+m/g, ""),
    stack: err.stack?.replace(/\u001b\[\d+m/g, ""),
  });
};

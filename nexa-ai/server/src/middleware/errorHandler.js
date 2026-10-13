/**
 * Centralized Global Error Handler Middleware
 * Normalizes Mongoose, JWT, OpenAI, and HTTP errors into consistent JSON responses.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid resource ID format: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `A record with this ${field} already exists.`
      : 'Duplicate key error.';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el) => el.message);
    message = errors.join(', ');
  }

  // Handle OpenAI API specific errors
  if (err.status && err.type) {
    statusCode = err.status;
    message = err.message || 'Error occurred while communicating with the AI service.';
  }

  // Ensure JSON response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      errorDetails: err,
    }),
  });
};

export default errorHandler;

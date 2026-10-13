/**
 * Higher-order function that catches async errors and forwards them to the Express error middleware.
 * Eliminates repetitive try-catch blocks in controller methods.
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

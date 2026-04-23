/**
 * Central error handler — keep API errors consistent for the frontend.
 */
function errorHandler(err, req, res, _next) {
    const status = err.status || err.statusCode || 500;
    const payload = {
        error: err.message || 'Internal server error',
    };
    if (process.env.NODE_ENV !== 'production' && err.details) {
        payload.details = err.details;
    }
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).json(payload);
}

module.exports = { errorHandler };

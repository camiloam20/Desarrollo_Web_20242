//backend/src/middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: se requieren privilegios de administrador'
        });
    }
    next();
};

module.exports = adminMiddleware;
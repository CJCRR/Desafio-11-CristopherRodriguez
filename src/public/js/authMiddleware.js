import config from '../../config/config.js';

const adminEmail = config.adminEmail;
const adminPassword = config.adminPassword;

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
};

const hasAdminCredentials = (email, password) => {
    // Verificar si las credenciales coinciden con las del administrador
    return email === adminEmail && password === adminPassword;
};

export { isAuthenticated, isAdmin, hasAdminCredentials };
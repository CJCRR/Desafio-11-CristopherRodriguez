import { Router } from "express";
import { isAuthenticated } from "../public/js/authMiddleware.js";
import { 
    viewsUserRegisterController,
    viewsUserLoginController,
    viewsUserProfileController,
    viewsUserLogoutController 
} from "../controllers/viewsUser.controller.js";

const router = Router();

// Ruta para el formulario de registro (pública)
router.get('/register', viewsUserRegisterController);

// Ruta para el formulario de inicio de sesión (pública)
router.get('/login', viewsUserLoginController);

// Ruta para el perfil del usuario (privada, requiere estar autenticado)
router.get('/profile', isAuthenticated, viewsUserProfileController);

// Ruta para cerrar sesión (privada, requiere estar autenticado)
router.get('/logout', isAuthenticated, viewsUserLogoutController);

export default router;
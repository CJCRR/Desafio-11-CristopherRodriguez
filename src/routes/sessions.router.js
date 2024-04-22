import { Router } from "express";
import passport from "passport";
import { 
  createUserController, 
  failCreateUserController, 
  loginUserController, 
  errorLoginUserController, 
  failLoginUserController,
  githubLoginUserController,
  githubCallbackLoginUserController,
  readInfoUserController 
} from "../controllers/session.controller.js";

const router = Router();

// crea un usuario
router.post('/register', createUserController);

// devuelve un error al registrar un usuario
router.get('/failRegister', failCreateUserController);

// inicia sesión
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin'}), loginUserController, errorLoginUserController);

// devuelve un error al iniciar sesión
router.get('/failLogin', failLoginUserController);

//Autenticación. Estrategia con GitHub.
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), githubLoginUserController);

// callback de GitHub para iniciar sesión
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallbackLoginUserController);

// devuelve los detalles del usuario actual
router.get('/current', readInfoUserController);

export default router;
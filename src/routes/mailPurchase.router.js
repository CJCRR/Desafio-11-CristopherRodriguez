import { Router } from "express";
import  { getbill } from '../controllers/mail.controller.js'

const router = Router();

router.post('/send', (req, res) => {
    const purchasedProducts = req.body.purchasedProducts;
    // Verificar que purchasedProducts sea un array
    if (!Array.isArray(purchasedProducts)) {
        return res.status(400).json({ error: 'Bad Request: purchasedProducts must be an array' });
    }

    // El resto del código del controlador va aquí
    purchasedProducts.forEach(getbill);
});

export default router;
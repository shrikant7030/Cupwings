import express from 'express';
import controller from '../controllers/user';
import extractJwt from '../middleware/extractjwt';

const router = express.Router();

router.get('/validate', extractJwt, controller.validateToken);
router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/get/all', extractJwt, controller.getAllUser);

export = router;

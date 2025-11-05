const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// GET /api/public/users?limit=50&q=texto
router.get('/users', publicController.getPublicUsers);

module.exports = router;

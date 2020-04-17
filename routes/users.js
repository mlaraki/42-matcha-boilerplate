const express = require('express');
const router = express.Router();
const {getAll, getById, deleteById} = require('../controllers/users');

router.get('/all', getAll);
router.get('/id/:id', getById);
router.delete('/id/:id', deleteById);

module.exports = router;
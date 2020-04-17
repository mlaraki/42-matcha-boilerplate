const express = require('express');
const router = express.Router();
const { refreshToken , revokeToken, validateToken} = require('../controllers/tokens');

router.post('/refreshToken', refreshToken);
router.post('/revokeToken', revokeToken);
router.post('/validateToken', validateToken);


module.exports = router;
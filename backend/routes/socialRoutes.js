const express = require('express')
const router = express.Router()

const {
    getSocial,
    updateSocial
} = require('../controllers/socialController')

router.get('/social', getSocial);
router.put('/social', updateSocial)

module.exports = router;
const express = require('express');
const router = express.Router();

const middleware = (req, res, next) => {
    next();
}

router.use(middleware);

router.get('/', async (req, res) => {
    res.status(200).json(require('../../documentation/fr'));
});

router.use('/categories', require('./categories'));
router.use('/products', require('./products'));
router.use('/remote', require('./remote'));

module.exports = router;
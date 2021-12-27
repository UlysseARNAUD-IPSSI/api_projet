const express = require('express');
const Product = require("../../database/models/product");
const Category = require("../../database/models/category");
const _headers = require('../../src/helpers/headers');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router();

const middleware = (req, res, next) => {
    next();
}

router.use(middleware);


/**
 * Récupère toutes les catégories de notre base de données
 */
router.get('/', async (req, res) => {
    const keys = Object.keys(Category.schema.obj);
    const {query: originalQuery} = req;
    const defaultQuery = {
        page_size: 12, // Nombre de produits par page
        pages: 10, // Nombre de pages
        start: 1, // Page de départ ; correspond à un entier non nul
    };
    const query = {...defaultQuery, ...originalQuery};
    const {page_size, pages, start} = query;
    let skip = undefined, limit = undefined;

    if (start && page_size && pages) {
        skip = Math.max(0, +start - 1) * +page_size;
        limit = (+start + +pages) * +page_size;
    }

    Category
        .find({}, {}, {skip, limit})
        .sort('name')
        .exec((err, categories) => {
            res.status(200).json({
                message: 'Catégories récupérées',
                data: {
                    count: categories.length,
                    page_size,
                    header: keys,
                    categories
                }
            });
        });
});

router.get('/search/:value', async (req, res) => {
    const keys = Object.keys(Category.schema.obj);
    let {value} = req.params;
    const filter = {name: new RegExp(value, 'i')};

    Category.find(filter, (err, categories) => {
        res.status(200).json({
            message: 'Catégories récupérées',
            data: {
                count: categories.length,
                header: keys,
                categories
            }
        });
    });
});

router.get('/get/:id', async (req, res) => {
    const {id} = req.params;

    const category = await Category.findById(id);

    if (!category) {
        res.status(422).json({message: `Catégorie inconnue`});
        return false;
    }

    res.status(200).json({
        message: 'Catégorie récupérée',
        data: category
    });
});

module.exports = router;
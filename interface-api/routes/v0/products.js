const express = require('express');
const Product = require("../../database/models/product");
const _headers = require('../../src/helpers/headers');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router();

const middleware = (req, res, next) => {
    next();
}

router.use(middleware);


/**
 * Récupère tous les produits de notre base de données
 */
router.get('/', async (req, res) => {
    const keys = Object.keys(Product.schema.obj);
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

    Product
        .find({}, {}, {skip, limit})
        .sort('product_name')
        .exec((err, products) => {
            res.status(200).json({
                message: 'Produits récupérés',
                data: {
                    count: products.length,
                    page_size,
                    header: keys,
                    products
                }
            });
        });
});

/**
 * Recherche les produits en fonction du code barre
 */
router.get('/search/barcode', async (req, res) => {
    const {query} = req;
    const defaultParams = {
        code: undefined,
        fields: [
            'url',
            'product_name',
            'product_name_fr',
            'brands',
            'nutrition_grade_fr',
            'categories',
            'image_thumb_url',
            'image_url',
            'created_t'
        ].join(',')
    }
    const {code, fields} = {...defaultParams, ...query};
    if (!code || !fields) res.status(422).json({
        message: 'Paramètre "code" ou "fields" invalide.'
    });
    const url = `https://world.openfoodfacts.org/api/v2/search?${new URLSearchParams({json: true, code, fields})}`;
    const {
        count,
        page, page_count, page_size, products,
        skip
    } = await fetch(url, {headers: _headers}).then(result => result.json());

    res.status(200).json({
        message: 'Recherche terminée',
        data: {count, page, page_count, page_size, products, skip}
    });
});

router.get('/search/:type/:value', async (req, res) => {
    const keys = Object.keys(Product.schema.obj);
    let {type, value} = req.params;

    type = type.toLowerCase();

    if (-1 === keys.indexOf(type)) {
        res.status(422).json({
            message: `Champs à rechercher invalide. Valeurs attendues : ${keys.map(key => `'${key}'`).join(', ')}`
        });
        return false;
    }

    const filter = {};
    filter[type] = new RegExp(value, 'i');

    const products = await Product.find(filter).sort('product_name');

    res.status(200).json({
        message: 'Produits récupérés',
        data: {
            count: products.length,
            header: keys,
            products
        }
    });
});

router.get('/get/:id', async (req, res) => {
    const {id} = req.params;

    const product = await Product.findById(id);

    if (!product) {
        res.status(422).json({message: `Produit inconnu`});
        return false;
    }

    res.status(200).json({
        message: 'Produit récupéré',
        data: product
    });
});

module.exports = router;
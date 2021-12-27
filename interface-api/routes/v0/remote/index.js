const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const router = express.Router();
const Product = require("../../../database/models/product");
const Category = require("../../../database/models/category");
const _headers = require('../../../src/helpers/headers');

const middleware = (req, res, next) => {
    // TODO : Ajouter permission + authentification
    next();
}

router.use(middleware);

/**
 * Enregistre les produits de openfoodfacts (et enregistre les catégories dans une nouvelle collection "categories").
 */
router.get('/retrieve', async (req, res) => {
    const keys = Object.keys(Product.schema.obj);
    const {query: originalQuery} = req;
    const defaultQuery = {
        page_size: 12, // Nombre de produits par page
        pages: 2, // Nombre de pages
        start: 1, // Page de départ ; correspond à un entier non nul
    };
    const query = {...defaultQuery, ...originalQuery};
    const {pages: countPage, start, page_size} = query;
    let page = +start - 1;
    const json = true;
    let resultProducts = [], resultCategories = [];

    while (true) {
        if (++page > +start + (+countPage - 1)) break;
        const url = `https://world.openfoodfacts.org?${new URLSearchParams({json, page, page_size})}`;
        const {
            page_count,
            products: originalProducts
        } = await fetch(url, {headers: _headers}).then(result => result.json());

        if (isNaN(+page_count) || 1 > +page_count) break;

        let products = originalProducts.map(product => keys.map(key => product[key] ?? undefined));

        for (const index in products) {
            const _product = products[index].reduce((result, field, index) => {
                result[keys[index]] = field;
                return result;
            }, {});

            _product.product_name = _product.product_name_fr ?? _product.product_name;

            const {product_name, url, brands, categories} = _product;

            if (!product_name || !brands || !url) continue;

            delete _product.categories;
            delete _product.created_t;

            let product = await Product.findOne({product_name}).exec();
            if (!product) product = await Product.create(_product);

            for (let name of categories.split(',')) {
                try {
                    name = name.trim();
                    if (!name) continue;
                    let category = await Category.findOne({name}).exec();
                    if (!category) category = await Category.create({name});
                    product.categories.push(category);
                    category.products.push(product);
                    await category.save();
                    if (0 > resultCategories.indexOf(category)) resultCategories.push(category);
                }
                catch(e) {
                    continue;
                }
            }

            await product.save();
            if (0 > resultProducts.indexOf(product)) resultProducts.push(product);
        }


    }

    res.status(200).json({
        message: 'Produits enregistrés',
        data: {
            categories: resultCategories,
            products: resultProducts
        }
    });
});

router.use('/categories', require('./categories'));
router.use('/products', require('./products'));

module.exports = router;
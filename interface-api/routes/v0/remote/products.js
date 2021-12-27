
const Product = require("../../../database/models/product");
const Category = require("../../../database/models/category");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const router = express.Router();

const middleware = (req, res, next) => {
    // TODO : Ajouter permission + authentification
    next();
}

router.use(middleware);

router.post('/create', async (req, res) => {
    const {query} = req, _product = {};
    const keys = Object.keys(Product.schema.obj);

    for (let key in query) if (-1 < keys.indexOf(key)) _product[key] = query[key];

    _product.product_name = _product.product_name_fr ?? _product.product_name;

    const {product_name, categories} = _product;

    delete _product.categories;

    let product = await Product.findOne({product_name});

    if (!product) product = await Product.create(_product);
    else product.categories = [];

    console.log({categories});

    for (let name of categories.split(',')) {
        name = name.trim();
        let category = await Category.findOne({name}).exec();
        if (!category) category = await Category.create({name});
        product.categories.push(category);
        category.products.push(product);
        await category.save();
    }

    await product.save();

    res.status(200).json({message: 'Produit enregistré', data: product});
});

router.post('/:id/update', async (req, res) => {
    const {query, params} = req, {id} = params, _product = {};
    const keys = Object.keys(Product.schema.obj);

    let product = await Product.findById(id);

    if (!product) {
        res.send(422).json({message: 'Produit inconnu'});
        return false;
    }

    for (let key in query) if (-1 < keys.indexOf(key)) _product[key] = query[key];

    const {categories} = _product;

    delete _product.categories;

    product.categories = [];

    for (let name of categories.split(',')) {
        name = name.trim();
        let category = await Category.findOne({name}).exec();
        if (!category) category = await Category.create({name});
        product.categories.push(category);
        category.products.push(product);
        await category.save();
    }

    await product.save(_product);

    res.status(200).json({message: 'Produit mis à jour', data: product});
});


router.get('/:id/delete', async (req, res) => {
    const {id} = req.params;

    let product = await Product.findById(id);

    if (!product) {
        res.send(422).json({message: 'Produit inconnu'});
        return false;
    }

    const {categories} = product;

    for (let categoryId of categories) {
        let category = await Category.findById(categoryId).exec();
        if (!category) continue;
        category.products.remove(product);
        await category.save();
    }

    await product.delete();

    res.status(200).json({message: 'Produit supprimé'});
});


module.exports = router;
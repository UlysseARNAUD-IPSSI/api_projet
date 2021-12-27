
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
    const {query} = req, _category = {};
    const keys = Object.keys(Category.schema.obj);

    for (let key in query) if (-1 < keys.indexOf(key)) _category[key] = query[key];

    const {name} = _category;

    let category = await Category.findOne({name});
    if (!category) category = await Category.create(_category);

    res.status(200).json({message: 'Catégorie enregistrée', data: category});
});

router.post('/:id/update', async (req, res) => {
    const {query, params} = req, {id} = params, _category = {};
    const keys = Object.keys(Category.schema.obj);

    let category = await Category.findById(id);

    if (!category) {
        res.send(422).json({message: 'Catégorie inconnue'});
        return false;
    }

    for (let key in query) if (-1 < keys.indexOf(key)) _category[key] = query[key];

    await category.save(_category);

    res.status(200).json({message: 'Catégorie mise à jour', data: category});
});


router.get('/:id/delete', async (req, res) => {
    const {id} = req.params;

    let category = await Category.findById(id);

    if (!category) {
        res.send(422).json({message: 'Catégorie inconnue'});
        return false;
    }

    const {products} = category;

    for (let productId of products) {
        let product = await Product.findById(productId).exec();
        if (!product) continue;
        product.categories.remove(category);
        await product.save();
    }

    await category.delete();

    res.status(200).json({message: 'Catégorie supprimée'});
});


module.exports = router;
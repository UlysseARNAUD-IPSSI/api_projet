const
    {Schema, Types, model} = require("mongoose"),
    helper = require('../../src/helpers/schema'),
    {ObjectId} = Types;

module.exports = model("product", Schema({
    url: helper.type(String).required().default('#').get(),
    product_name: helper.type(String).required().default('Sans nom').get(),
    product_name_fr: helper.type(String).get(),
    brands: helper.type(String).required().default('Sans marque').get(),
    nutrition_grade_fr: helper.type(String).get(),
    categories: [helper.type(ObjectId).ref('category').get()],
    image_thumb_url: helper.type(String).get(),
    image_url: helper.type(String).get(),
    created_t: helper.type(String).required().default((new Date()).valueOf()).get(),
}));

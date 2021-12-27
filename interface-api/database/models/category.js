const
    {Schema, Types, model} = require("mongoose"),
    helper = require('../../src/helpers/schema'),
    {ObjectId} = Types;

module.exports = model("category", Schema({
    name: helper.type(String).required().get(),
    products: [helper.type(ObjectId).ref('product').get()],
    created_t: helper.type(String).required().default((new Date()).valueOf()).get(),
}));

const Sequelize = require("sequelize");
const db = require('../config/DBConfig');

const Product = db.define("product", {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.DECIMAL(10, 2)
    },
    imageURL: {
        type: Sequelize.STRING
    }
});


module.exports = Product;
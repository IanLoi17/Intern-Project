const Sequelize = require("sequelize");
const db = require('../config/DBConfig');
const router = require("../routes/product");

const Product = db.define("product", {
    ProductName: {
        type: Sequelize.STRING
    },
    ProductQuantity: {
        type: Sequelize.STRING
    },
    ProductImage: {
        type: Sequelize.STRING
    },
    ProductDesc: {
        type: Sequelize.STRING
    },
    ProductPice: {
        type: Sequelize.DOUBLE(10,2)
    },
    ProductType: {
        type: Sequelize.STRING
    }
});

module.exports = Product;
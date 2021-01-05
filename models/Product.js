const Sequelize = require("sequelize");
const db = require('../config/DBConfig');

const Product = db.define("product", {
    ProductName: {
        type: Sequelize.STRING
    },
    ProductQuantity: {
        type: Sequelize.INTEGER
    },
    ProductImage: {
        type: Sequelize.STRING
    },
    ProductDesc: {
        type: Sequelize.STRING
    },
    ProductPrice: {
        type: Sequelize.DECIMAL(10,2)
    },
    ProductType: {
        type: Sequelize.STRING
    }
});


module.exports = Product;
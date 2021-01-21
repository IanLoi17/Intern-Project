const Sequelize = require("sequelize");
const db = require('../config/DBConfig');

const Product = db.define("product", {
    ProductId: {
        type: Sequelize.STRING
    },
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
    ProductCostPrice: {
        type: Sequelize.DECIMAL(10,2)
    },
    ProductSellingPrice: {
        type: Sequelize.DECIMAL(10,2)
    },
    ProductType: {
        type: Sequelize.STRING
    },
    BuyingDateTime:{
        type: Sequelize.DATE
    },
    SellingDateTime: {
        type: Sequelize.DATE
    }
});


module.exports = Product;
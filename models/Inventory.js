const Sequelize = require("sequelize");
const db = require('../config/DBConfig');

const Inventory = db.define("inventory", {
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
    ProductCostPrice: {
        type: Sequelize.DECIMAL(10,2)
    },
    ProductType: {
        type: Sequelize.STRING
    },
    BuyingDateTime:{
        type: Sequelize.DATE
    }
});


module.exports = Inventory;
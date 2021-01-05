const Sequelize = require("sequelize");
const db = require('../config/DBConfig');


const User = db.define("user", {
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    DOB: {
        type: Sequelize.DATE
    },
    password: {
        type: Sequelize.STRING
    }
});


module.exports = User;
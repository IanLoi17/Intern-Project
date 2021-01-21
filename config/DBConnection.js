const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const product = require('../models/Product');
const inventory = require('../models/Inventory');


const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log("Ecommerce database connected!");
    })
    .then(() => {
        user.hasMany(product);
        mySQLDB.sync({
            force: drop
        }).then(() => {
            console.log("Create tables if non exists!")
        }).catch(err => console.log(err))
    })
    .catch(err => console.log('Error: ' + err));
};


module.exports = {setUpDB};
const moment = require('moment');
const Cryptr = require('cryptr');


module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
};
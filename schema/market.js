const mongoose = require('mongoose');

const market = mongoose.Schema({
    market : 'string',
    korean_name : 'string',
    english_name : 'string',
    market_warning : 'string'
})

module.exports = {
    market
}
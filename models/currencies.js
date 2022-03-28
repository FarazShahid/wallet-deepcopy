const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Currencies Schema 
const CurrenciesSchema = new Schema({
    currency: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    }
});
module.exports = Currencies = mongoose.model("currencies", CurrenciesSchema);

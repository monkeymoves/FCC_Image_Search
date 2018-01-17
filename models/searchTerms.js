const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//model
const searchTermsSchema = new Schema(

    {
        searchVal: String,
        searchDate: Date
    },
    {timestamps: true}
);

//connect model & collection

const ModelClass = mongoose.model('searchTerm', searchTermsSchema);

module.exports = ModelClass;
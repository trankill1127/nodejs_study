const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://trankill1127:%40!kjy1127!%40@cluster0.9dbkcfm.mongodb.net/board";

module.exports = function(callback){
    return MongoClient.connect(uri, callback);
}
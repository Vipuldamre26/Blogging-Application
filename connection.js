const mongoose = require('mongoose');

async function dbConnection(url){
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}


module.exports = {
    dbConnection,
}
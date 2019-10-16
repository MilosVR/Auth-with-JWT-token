const mongoose = require('mongoose');
const mongoURI = require('../config/secret').mongoURI

const mongoDB = () => (
    mongoose.connect(mongoURI, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify:false
        } 
        ))
        .then(() => console.log('Mongo DB connected'))
        .catch(err => console.log(err))

module.exports = mongoDB
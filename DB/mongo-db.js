const mongoose = require('mongoose');

exports.connect = async () => {
    mongoose.connect(process.env.MONGO_KEY, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

exports.close = async () => {
    try {
        mongoose.connection.close();
    } catch (error) {
        console.log('error on closing mongo', error);
    }
}
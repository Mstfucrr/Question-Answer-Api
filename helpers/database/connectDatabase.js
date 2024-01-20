const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDatabase = () => {
    // İlk .env dosyasını yükle
    dotenv.config({ path: './config/env/.env' });

    const password = process.env.MONGO_PASSWORD;
    const username = process.env.MONGO_USERNAME;
    const database = process.env.MONGO_DATABASE;
    const URI = `mongodb+srv://${username}:${password}@mmu.lzzqp.mongodb.net/${database}?retryWrites=true&w=majority`;
    console.log(URI);
    mongoose.connect(URI, { useNewUrlParser: true })
        .then(() => {
            console.log("Mongoose connected");
        })
        .catch(err => {
            console.error(err);
        })
}

module.exports = connectDatabase;
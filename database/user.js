const mongoose = require('mongoose');


//database configure
var db = mongoose.connection;
//連線失敗
db.on('error', console.error.bind(console, 'connection error:'));
//連線成功
db.once('open', function () {
    console.log("userDB connection success...");
});
//建立連線
mongoose.connect('mongodb://localhost/alfred', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });

var schema = mongoose.Schema;
//user schema model
var userSchema = new schema({
    telegramUserID: String,
    telegramUsername: String,
    points: Number,
    commandAmount: Number,
    checkin: String,
    card: [
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
    ],
    evolveCard: [
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        },
        {
            cardStatus: String,
            cardAmount: Number,
            selling: String
        }
    ]
});


var user = mongoose.model('user', userSchema);

// make this available to our users in our Node applications
module.exports = user;
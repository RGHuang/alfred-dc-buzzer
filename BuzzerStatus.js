const mongoose = require('mongoose');
require('dotenv').config();

//database configure
var db = mongoose.connection;
//連線失敗
db.on('error', console.error.bind(console, 'connection error:'));
//連線成功
db.once('open', function () {
    console.log("buzzerDB connection success...");
});
//建立連線
mongoose.connect(`${process.env.BUZZER_MONGODB_URL}`, { useNewUrlParser: true }).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });

var schema = mongoose.Schema;
//buzzerStatus schema model
var buzzerStatusSchema = new schema({
    sendWarningToSlackOrNot: String,
    awakeOrNot: Boolean,
    index: Number
});


var buzzerStatus = mongoose.model('buzzerStatus', buzzerStatusSchema);

// make this available to our buzzerStatuss in our Node applications
module.exports = buzzerStatus;



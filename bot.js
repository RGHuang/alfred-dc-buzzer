require('dotenv').config();
const slackAPI = require('slackbots');
var CronJob = require('cron').CronJob;
// Dependencies
const buzzerStatusDB = require('./BuzzerStatus');
const targetChannel = 'buzzer_alfred';

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'DC_Buzzer'
    })
/*
var initStatus = new buzzerStatus({
    sendWarningToSlackOrNot: false
})
writeDataIntoDB(initStatus);
*/



let checkStatusCron = new CronJob('* 2 * * * * ', async function () {
    console.log('start checking');
    var status = await getBuzzerStatus();
    //console.log(status);
    sendErrorMessage(status);
}, null, true, 'America/Los_Angeles');
checkStatusCron.start();



function changeStatusToFalse() {
    buzzerStatusDB.updateOne({ index: 0 },
        { sendWarningToSlackorNot: false }).then(result => {
            console.log(result);
        })
}


async function getBuzzerStatus() {
    try {
        var buzzerStatus = await buzzerStatusDB.findOne({ index: 0 }).exec();
        var sendorNot = buzzerStatus._doc.sendWarningToSlackorNot;
        console.log(sendorNot);
        return sendorNot;
    } catch (err) {
        console.error(err);
    }
}

function sendErrorMessage(status) {
    if (!status) {
        slackBot.on('message', () => {
            slackBot.postMessageToChannel(targetChannel, 'DC Bot is not working!');
        })
    } else {
        slackBot.on('message', () => {
            changeStatusToFalse();
            console.log("dc bot alive");
        })
    }
}
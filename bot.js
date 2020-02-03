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
    sendWarningToSlackorNot: false
})
writeDataIntoDB(initStatus);
*/



let checkDCStatusCron = new CronJob('* 10 * * * * ', async function () {
    console.log('start checking DC');
    var DCstatus = await getDCBuzzerStatus();
    console.log("DC working", DCstatus);
    sendDCErrorMessage(DCstatus);
    changeDCStatusToFalse();
}, null, true, 'America/Los_Angeles');
checkDCStatusCron.start();

let checkTGStatusCron = new CronJob('* 10 * * * * ', async function () {
    console.log('start checking TG');
    var TGstatus = await getTGBuzzerStatus();
    sendTGErrorMessage(TGstatus);
    changeTGStatusToFalse();
}, null, true, 'America/Los_Angeles');
checkTGStatusCron.start();



async function getDCBuzzerStatus() {
    try {
        var buzzerStatus = await buzzerStatusDB.findOne({ index: 0 }).exec();
        var sendorNot = buzzerStatus._doc.sendWarningToSlackorNot;
        console.log(sendorNot);
        return sendorNot;
    } catch (err) {
        console.error(err);
    }
}

async function getTGBuzzerStatus() {
    try {
        var buzzerStatus = await buzzerStatusDB.findOne({ index: 1 }).exec();
        var sendorNot = buzzerStatus._doc.sendWarningToSlackorNot;
        console.log(sendorNot);
        return sendorNot;
    } catch (err) {
        console.error(err);
    }
}


function sendDCErrorMessage(status) {
    if (!status) {
        slackBot.on('message', () => {
            slackBot.postMessageToChannel(targetChannel, 'DC Bot is not working!');
        })
    } else {
        console.log("DC bot alive");
    }
}

function sendTGErrorMessage(status) {
    if (!status) {
        slackBot.on('message', () => {
            slackBot.postMessageToChannel(targetChannel, 'TG Bot is not working!');
        })
    } else {
        console.log("TG bot alive");
    }
}


function changeDCStatusToFalse() {
    buzzerStatusDB.updateOne({ name: "DCBuzzer" },
        { sendWarningToSlackorNot: false }).then(result => {
            console.log(result);
        })
}

function changeTGStatusToFalse() {
    buzzerStatusDB.updateOne({ name: "TGBuzzer" },
        { sendWarningToSlackorNot: false }).then(result => {
            console.log(result);
        })
}


require('dotenv').config();
const slackAPI = require('slackbots');
let schedule = require('node-schedule');
// Dependencies
const buzzerStatusDB = require('./BuzzerStatus');
const targetChannel = 'buzzer_alfred';

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'ALFRED_Bot_Heartbeat'
    })
/*
var initStatus = new buzzerStatus({
    sendWarningToSlackorNot: false
})
writeDataIntoDB(initStatus);
*/


let checkDiscordBotAliveSchedule = new schedule.scheduleJob('10 * * * * * ', async function () {
    var discordBotStatus = await getDiscordBotStatus();
    let time = new Date();
    sendDCErrorMessage(discordBotStatus, time);
    changediscordBotStatusToFalse();
    console.log("check discord status at " + new Date());
});


let checkTelegramBotAliveSchedule = new schedule.scheduleJob('10 * * * * * ', async function () {
    var telegramBotStatus = await getTelegramBotStatus();
    let time = new Date();
    sendTGErrorMessage(telegramBotStatus, time);
    changetelegramBotStatusToFalse();
    console.log("check telegram status at " + new Date());
});

async function getDiscordBotStatus() {
    try {
        var buzzerStatus = await buzzerStatusDB.findOne({ index: 0 }).exec();
        var sendorNot = buzzerStatus._doc.sendWarningToSlackorNot;
        return sendorNot;
    } catch (err) {
        console.error(err);
    }
}

async function getTelegramBotStatus() {
    try {
        var buzzerStatus = await buzzerStatusDB.findOne({ index: 1 }).exec();
        var sendorNot = buzzerStatus._doc.sendWarningToSlackorNot;
        return sendorNot;
    } catch (err) {
        console.error(err);
    }
}


function sendDCErrorMessage(status, time) {
    if (!status) {
        slackBot.postMessageToChannel(targetChannel, 'Discord Bot is not working at' + time);
    } else {
        console.log("Discord bot alive");
    }
}

function sendTGErrorMessage(status, time) {
    if (!status) {
        slackBot.postMessageToChannel(targetChannel, 'Telegram Bot is not working at' + time);
    } else {
        console.log("Telegram bot alive");
    }
}


function changediscordBotStatusToFalse() {
    buzzerStatusDB.updateOne({ name: "DCBuzzer" },
        { sendWarningToSlackorNot: false }).then(result => {
            console.log(result);
        })
}

function changetelegramBotStatusToFalse() {
    buzzerStatusDB.updateOne({ name: "TGBuzzer" },
        { sendWarningToSlackorNot: false }).then(result => {
            console.log(result);
        })
}


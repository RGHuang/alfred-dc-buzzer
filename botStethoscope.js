require('dotenv').config();
const slackAPI = require('slackbots');
let schedule = require('node-schedule');
// Dependencies
const buzzerStatus = require('./BuzzerStatus');
const targetChannel = 'buzzer_alfred';
const versionText = 'ver 1.0';
const discordBotErrorText = '【Discord Bot ' + versionText + '】 stopped at ';
const telegramBotErrorText = '【Telegram Bot ' + versionText + '】 stopped at ';
const params = {
    icon_emoji: ':stethoscope_production:'
}

const slackBot =
    new slackAPI({
        token: `${process.env.SLACK_TOKEN}`,
        name: 'ALFRED_Bot_Stethoscope (Production)'
    })
/*
var initStatus = new buzzerStatus({
    sendWarningToSlackOrNot: false
})
writeDataIntoDB(initStatus);
*/
process.env.TZ = 'Asia/Shanghai'

let checkDiscordBotAliveSchedule = new schedule.scheduleJob('10 * * * * * ', async function () {
    var discordBotSendOrNotString = await getDiscordBotSendOrNotString();
    console.log("check discord status at " + new Date());
    let time = new Date();
    if (discordBotSendOrNotString == "false") {
        sendErrorMessageToSlack(discordBotErrorText, time);
        updateDiscordBotStringToAlreadySend();
    } else if (discordBotSendOrNotString == "true") {
        updateDiscordBotStringToFalse();
    }
});


let checkTelegramBotAliveSchedule = new schedule.scheduleJob('10 * * * * * ', async function () {
    var telegramBotSendOrNotString = await getTelegramBotSendOrNotString();
    console.log("check telegram status at " + new Date());
    let time = new Date();
    if (telegramBotSendOrNotString == "false") {
        sendErrorMessageToSlack(telegramBotErrorText, time);
        updateTelegramBotStringToAlreadySend();
    } else if (telegramBotSendOrNotString == "true") {
        updateTelegramBotStringToFalse();
    }
});

async function getDiscordBotSendOrNotString() {
    try {
        var buzzer = await buzzerStatus.findOne({ name: "DiscordBuzzer" }).exec();
        var sendorNotString = buzzer._doc.sendWarningToSlackOrNot;
        return sendorNotString;
    } catch (err) {
        console.error(err);
    }
}

async function getTelegramBotSendOrNotString() {
    try {
        var buzzer = await buzzerStatus.findOne({ name: "TelegramBuzzer" }).exec();
        var sendorNotString = buzzer._doc.sendWarningToSlackOrNot;
        return sendorNotString;
    } catch (err) {
        console.error(err);
    }
}


function sendErrorMessageToSlack(message, time) {
    slackBot.postMessageToChannel(targetChannel, message + time, params);
}



function updateDiscordBotStringToAlreadySend() {
    buzzerStatus.updateOne({ name: "DiscordBuzzer" },
        { sendWarningToSlackOrNot: "alreadySend" }).then()
}

function updateTelegramBotStringToAlreadySend() {
    buzzerStatus.updateOne({ name: "TelegramBuzzer" },
        { sendWarningToSlackOrNot: "alreadySend" }).then()
}

function updateDiscordBotStringToFalse() {
    buzzerStatus.updateOne({ name: "DiscordBuzzer" },
        { sendWarningToSlackOrNot: "false" }).then()
}

function updateTelegramBotStringToFalse() {
    buzzerStatus.updateOne({ name: "TelegramBuzzer" },
        { sendWarningToSlackOrNot: "false" }).then()
}


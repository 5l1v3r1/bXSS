const Twilio = require('twilio');
const moment = require('moment');
const fs = require('fs');
const save = require('../save');
const template = require('../templates/reporting');

const path = require('path');

const datePath = path.normalize(`${__dirname}/../../../server/found/date.txt`);

exports.send = (guid, domain, config) => {
  if (
    !config.isValid({
      'twilio.accountSid': 'string',
      'twilio.authToken': 'string',
      'twilio.to': 'array'
    })
  ) {
    console.log('You need to configure your twilio account');
    return;
  }
  if (!this.lastSms()) {
    const client = new Twilio(config.twilio.accountSid, config.twilio.authToken);
    config.twilio.to.forEach(element => {
      client.messages
        .create({
          from: config.twilio.from,
          to: element,
          body: template.createPlainText(domain, guid)
        })
        .then(message =>
          console.log(`SMS send to ${element} from ${config.twilio.from} MSG ID ${message.sid}`)
        );
      save.saveTodaysDate();
    });
  } else {
    console.log(`Already Sent SMS Today`);
  }
};
// Check to see if we sent an SMS in the last day
exports.lastSms = () => {
  const lastDate = fs.readFileSync(datePath, 'utf8').trim();
  const currentTime = moment().format('YYYY-MM-DD');
  return currentTime === lastDate;
};

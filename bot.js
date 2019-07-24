// required scripts
const tmi = require('tmi.js');
var GoogleSpreadsheet = require('google-spreadsheet');

/// GOOGLE SHEETS ///

// These are your google service account credentials
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var sheet_id = '*Your spreadsheet ID here*'
var doc = new GoogleSpreadsheet(sheet_id);

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {
});

/// BAD WORDS FILTER ///
var Filter = require('bad-words'),
  filter = new Filter({ replaceRegex: /[A-Za-z0-9가-힣_]/g }),
  assert = require('better-assert');


/// TWITCH ///

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  //If the message contains '!add', we invoke the 'sendStringToDrive' function.
  if (commandName.includes('!add')) {

    // Removes the '!add ' portion of the command
    const string = commandName.slice(5)

    // checks if the command contains profanity
    if (!filter.isProfane(string)) {
      checkFormat(string)
    } else {
      client.say(target, `Oops, I can't add that code!`)
      console.log(target, `Failed to add ${string}`)
    }

    // checkFormat is used to confirm the formatting of your string. This could be done in many ways but in the case below I simply check if the string is 19 characters long.
    function checkFormat(s) {
      // Rudimentary, but this line checks that the string (s) is exactly 19 characters long. This is specifically for Mario Maker levels, but can be modified for other purposes.
      s.length === 19
        ? sendStringToDrive(s)
        : client.say(target, `I couldn't add that. Codes should be in "0000-0000-0000-0000" format.`);
    }

    function sendStringToDrive(s) {

      // Adds to sheet index 1 (the first sheet of the doc)
      // Uses a key:value paid. The key ('LevelCode') is the top-row name
      // You can add more pairs but adding a comma and additional key:value
      doc.addRow(1, { LevelCode: string }, function (err) {
        // The bot will confirm in chat
        client.say(target, `Added "${string}" to sheet`);
        // Throw an error if it don't work
        if (err) {
          console.log(err);
        }
      });
    }

    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
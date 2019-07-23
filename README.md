This bot runs on node.js. It uses a few dependencies: async, google-spreadsheets and tmi
I started by cloning the basic twitch bot like the instructions here: https://dev.twitch.tv/docs/irc/

There are a few things to set up before looking at the code. I recommend following the Google Drive
API & Service accounts tutorial here: https://www.twilio.com/blog/2017/03/google-spreadsheets-and-javascriptnode-js.html
Download the JSON as per the tutorial, rename it 'client_secret.json' and upload it to your Glitch project.

Create your spreadsheet then share it with the service account you create above with editing rights
Get the spreadsheet ID (from the URL, after /d/) and enter it into the new GoogleSpreadsheet('') variable below

Next, you need to create a Twitch account for the bot and generate an oauth token for it. Browse to
https://twitchapps.com/tmi/ while logged in as the bot to generate an oauth password.
Next, open .env and add the bot's credentials as well as the name of the channel you want the bot to run on. 

Your bot should now be ready to go. Test it by using the !add [text] command in chat.
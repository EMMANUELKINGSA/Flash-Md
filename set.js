const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0FwMVZPQnp0YlVLU0xtTFQ2WUNxVEl5TkRFdWFzVldFbENoS2U2UFlXWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOFZxTXNmSTBrUytXck9rNnRmQnVPZWVLYlBuTDcxUmFNajQzWjVpY3NFaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRSVduZEM2Mk5EV3dySGlrOXkrRUN3RmpoVnJmNVUvUUZYaE52WDVQc0cwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIveWFTd2RuaDlpaDlremtXYXUrWUZiYWV1TWVTazA0VG1GNDFSdjFWaFJRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkVLTG4zY0ZtRnNkMDExbDRKWFVtS3plOE5VSmlCNW5DcGhBaXdZdC9qRW89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IncyZ1k0S2IvNWdDYjR3T09TOWNWZVlwSmxBUktaTmpoUWZFZTJZTEFCM0k9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNFBZTTUzc0k3bE9SQ1JRKzk3QjVuajVwaTlXSjNVWkd0cnFVK2QwbjEyQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOVpjZEhQV1liV0J4dWtDemhGVWxLdEpzZE9INDhGTHI5WUlkcnYrUWtUUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRIdFdUQWxuV2JTa2NLVjZJMU9ZK3pyRm52RXQ2cTVxYk9aLzh6bUZ0cURXVmt6cW1GNUtyZDd5akdOaUM4enVpc3hQRkIrSm84dGVCYWJ1cTV1UGhnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MSwiYWR2U2VjcmV0S2V5IjoiZVZVQmJkcitJQWRDTFB6VTd4Z0VSTU5ObXFQNUlzUFduRERMZzdqOGk1MD0iLCJwcm9jZXNzZWRIaXN0b3J5TWVzc2FnZXMiOlt7ImtleSI6eyJyZW1vdGVKaWQiOiIxODY4Mjk2MTkxMkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIyRDYwOTZDMzZBRUFDNjM1OUE5NDgxMUE2NUMyNUQ3QyJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzMyNjUxMzMxfSx7ImtleSI6eyJyZW1vdGVKaWQiOiIxODY4Mjk2MTkxMkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIwRjVGNjY2RDgyRkRDQ0RCQkEzODAzOThFOEM5NkM2MCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzMyNjUxMzMyfSx7ImtleSI6eyJyZW1vdGVKaWQiOiIxODY4Mjk2MTkxMkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIxRThFREQ1QzM4RTFGNDcwRDQwQjE0NkZEQkM2QzIyMyJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzMyNjUxMzM3fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiItRXY1NjJBN1RnMjFrdFlsOXkzeWRRIiwicGhvbmVJZCI6IjVjZTFiY2YwLWZjNTQtNDczZi1hZjJjLTg4ODc1NzQyZjE0OSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLczJOb3FJeFJkQXdiclhwMkt6QXhGeTlTT1k9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMzRJdjAzajF3MlMvcVdFWVVrVDQrZ2ZoUkQ4PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjRCRkJHV1RZIiwibWUiOnsiaWQiOiIxODY4Mjk2MTkxMjo1OUBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJFbWFu8J+RvyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS1RRNmNRRkVMYlNtTG9HR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiODdzTHVURkdXZ1J4S0Y4aWxiMWs5NklCbkpaZ3hhT1BsRG81UjVTVlpVbz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiQ2JiUlhFWWVjRjZHb24vNXhTWHZsN3BBS01FbDR1R3JnSnByeTluR3d4Y05DQWUxRnE0c0tqMVYxTSt1aXhQTkJ2OFNZalRGb2Z2MFBWWGlXdFp3RFE9PSIsImRldmljZVNpZ25hdHVyZSI6InQ4TkpuK1J0TlgwRmhmQ2RaQytpL3pRNUVleVN4aGZuZ0cxY0g3cGNJQTFDaVBGTTFqNWphR0oxT09mSGh1cVdxdTN3YWIzUk5TVmppcXJPWXc3cGlBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMTg2ODI5NjE5MTI6NTlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZk83QzdreFJsb0VjU2hmSXBXOVpQZWlBWnlXWU1Xamo1UTZPVWVVbFdWSyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczMjY1MTMzMCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFGWjkifQ==,
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Eman",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "18682961912",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "off",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

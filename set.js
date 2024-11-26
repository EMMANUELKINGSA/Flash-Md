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
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUp4Qzg5MnBMcEUxSzF0ckZHbWJsbDRtZXZ4SmN2bDdZSlpZQ0VOVkpVcz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMGk3QjhHS2s0QUNaWWN6a2tVWVVxNUljQzhmRVZNQUh4SU95cGRMUkVUND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5SjVVbldqVHJ0cDFFNlo4WXdXUW1RZlBkdDJyZE5sOXZReXNCSitkaEdzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBdHRYNFM4SkUxOTBPQ1JxQzZpZER0NlA4Y2VPZWl4MXhZbDVDWmFnQjEwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlEVmJFem1ZekdoeVdTQTlzalRoQjd1Q2FiY0ZlTEZZVkRNQzM3RHlmbE09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjBwRktIejY5Zi9IVkY3bEdINWFyVnp3eGNGcENKRVp5WE94cDRGcDJhblk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUlCVXJBdVBXT2JYVFdSZ1hqVmJtaWlFN3RKd3pSL29iSElrTGR4WktsTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTVF6bGxmemNOYktUb3F0ZkRhTjlZcDBuMjIzU2JpU1NNdVBxRytzb0hDTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImU5OWkxMDNPVmtCaWt5QTUxdE9XQXE5SjByT3JKRWgxdnhPUTNTT1pWUko3TDNUcDJ4Q21CbVlGcjZWTjEyVHQxcUhGWFgwN3phM0R6UFByeGdlakRRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTA1LCJhZHZTZWNyZXRLZXkiOiJVVlZjRzNNczUvMHBkZFJEd280MWlvd3lveDZleWp6bnZUdDQ2U0RVWkUwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjE4NjgyOTYxOTEyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjA2NzdBM0UzMEY3NDBENTI4OUNCQzQyNDQ2Njg2MzBEIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzI2NTIzMDV9LHsia2V5Ijp7InJlbW90ZUppZCI6IjE4NjgyOTYxOTEyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkQxMzkyNjUzOTE3NjkxMjg4RjE4ODU1OTBFQ0M0NEM3In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzI2NTIzMDV9LHsia2V5Ijp7InJlbW90ZUppZCI6IjE4NjgyOTYxOTEyQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE2NTU0Q0Y0OTgxRThCRjg1N0QzNUI3RDg5QUU3QjI5In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MzI2NTIzMTJ9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6InZLRzZncENMUTNPQjBZeUJld0dVb1EiLCJwaG9uZUlkIjoiYTMxN2U5ZjEtMjUyYi00MDJjLWI1MDktYTk3YTM2OTllNjg4IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpxVUZzNVRRdDFjYXZiditJZDhVRkFENEVqTT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJaWWxJTCs0Ui9vaFloeVpiWmhyL01CN2FSZEU9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiRzZDWDlOUUUiLCJtZSI6eyJpZCI6IjE4NjgyOTYxOTEyOjYwQHMud2hhdHNhcHAubmV0In0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLWFE2Y1FGRUlMYW1Mb0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiI4N3NMdVRGR1dnUnhLRjhpbGIxazk2SUJuSlpneGFPUGxEbzVSNVNWWlVvPSIsImFjY291bnRTaWduYXR1cmUiOiIvUWJNMFRVV3c5TkIxZ2s5YU55S1BEZTVoeUVNSFhQSEVJeVFnM09VdVVjRUpEOVc1eEhjRzlMUWFkQ2dRV2pFaEYrVXppakw5aVN5WWhLR2xBN1BDQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiUjRwZWJTMk14L245S2FDWjZnRDZpWExacnhtL1NBbmlWVU14dkJBUWZiNUtuWEQwckI0eTdORW15SXBXOGhtN0x0UUU4YmpiMGVvWHhYc2loeXJDQ1E9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIxODY4Mjk2MTkxMjo2MEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJmTzdDN2t4UmxvRWNTaGZJcFc5WlBlaUFaeVdZTVdqajVRNk9VZVVsV1ZLIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzMyNjUyMzAzLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUZaLyJ9,
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

const { app } = require('electron');
const fixPath = require('fix-path');
const Sentry = require('@sentry/electron');
const trayMain = require('./src/modules/tray');

fixPath();
Sentry.init({ dsn: 'https://18c9943a576d41248b195b5678f2724e@sentry.io/1506479' });

let tray;
if (app.dock) app.dock.hide();
app.on('ready', () => {
  tray = trayMain.trayIcon()
});

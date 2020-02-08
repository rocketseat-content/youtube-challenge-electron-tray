const { resolve } = require('path');
const {
  app, BrowserWindow, Tray,
} = require('electron');
const positioner = require('electron-traywindow-positioner');

const Sentry = require('@sentry/electron');

Sentry.init({ dsn: 'https://18c9943a576d41248b195b5678f2724e@sentry.io/1506479' });

if (app.dock) {
  app.dock.hide();
}

const mainWidth = 500;
const mainHeight = 600;

let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: mainWidth,
    height: mainHeight,
    frame: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.hide();

  mainWindow.loadFile('./main.html');
  mainWindow.on('blur', () => mainWindow.hide());

  // mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
  app.allowRendererProcessReuse = true;
  createWindow();
  const mainTray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));
  mainTray.on('click', (e, p) => {
    mainWindow.show();
    mainWindow.focus();
    const position = positioner.calculate(mainWindow.getBounds(), mainTray.getBounds());
    mainWindow.setPosition(position.x, position.y);
  });
});

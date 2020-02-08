const { resolve } = require('path');
const {
  app, BrowserWindow, Tray, screen,
} = require('electron');

const Sentry = require('@sentry/electron');
// Sentry.init({ dsn: 'https://18c9943a576d41248b195b5678f2724e@sentry.io/1506479' });

if (app.dock) {
  app.dock.hide();
}

let windowSizes;
let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
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
  windowSizes = screen.getPrimaryDisplay().size;
  createWindow();
  const mainTray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));
  mainTray.on('click', (e, p) => {
    mainWindow.show();
    mainWindow.focus();

    mainWindow.setPosition(p.x, p.y, false);
    mainWindow.setSize(windowSizes.width - p.x, 900, false);
  });
});

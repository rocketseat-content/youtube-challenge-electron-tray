const { resolve, basename } = require('path');
const {
  app, Menu, Tray, dialog, BrowserWindow,
} = require('electron');
const spawn = require('cross-spawn')
const Store = require('electron-store');
const Sentry = require('@sentry/electron');

Sentry.init({ dsn: 'https://18c9943a576d41248b195b5678f2724e@sentry.io/1506479' });

const schema = {
  projects: {
    type: 'string',
  },
};

let mainTray = {}
let prefsWindow = null;

if (app.dock) {
  app.dock.hide()
}

const store = new Store({ schema });

function render(tray = mainTray) {
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];

  const items = projects.map(( {name, path} ) => ({
    label: name,
    submenu: [
      {
        label: 'Abrir no VSCode',
        click: () => {
          spawn('code', [path],{
            cwd: process.cwd(),
            env: {
              PATH: process.env.PATH,
            },
            stdio: ['inherit'],
          })
        },
      },
      {
        label: 'Remover',
        click: () => {
          store.set('projects', JSON.stringify(projects.filter(item => item.path !== path)));
          render();
        },
      },
    ],
  }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Adicionar novo projeto...',
      click: () => {
        const result = dialog.showOpenDialog({ properties: ['openDirectory'] });

        if (!result) return;

        const [path] = result;
        const name = basename(path);

        store.set(
          'projects',
          JSON.stringify([
            ...projects,
            {
              path,
              name,
            },
          ]),
        );

        render();
      },
    },
    {
      type: 'separator',
    },
    ...items,
    {
      type: 'separator',
    },
    {
      label: 'Preferences',
      click: () => {
        prefsWindow.show();
      }
    },
    {
      type: 'normal',
      label: 'Fechar Code Tray',
      role: 'quit',
      enabled: true,
    },
  ]);

  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  mainTray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

  render(mainTray);

  prefsWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 250,
    maximizable: false,
    minimizable: false
  });
  prefsWindow.loadURL(`file://${__dirname}/pages/settings.html`);
  prefsWindow.on('close', (evt) => {
    evt.preventDefault();
    prefsWindow.hide();
  })
});

const { resolve, basename } = require('path');
const {
  app, Menu, Tray, dialog,
} = require('electron');
const { spawn } = require('child_process');
const Store = require('electron-store');
const Sentry = require('@sentry/electron');

Sentry.init({ dsn: 'https://18c9943a576d41248b195b5678f2724e@sentry.io/1506479' });

const isWindows = process.platform.includes('win');

const store = new Store();

if(app.dock){
    app.dock.hide()
}

let tray = null;
let trayPosition = {};

function render() {
  const storedProjects = store.get('projects');
  const projects = storedProjects || [];

  const items = projects.map(project => ({
    label: project.name,
    submenu: [
      {
        label: 'Abrir no VSCode',
        click: () => {
          spawn('code', [project.path], {
            cwd: process.cwd(),
            env: {
              PATH: process.env.PATH,
            },
            stdio: 'inherit',
            shell: isWindows
          });
        },
      },
      {
        label: 'Remover',
        click: () => {
          store.set('projects', projects.filter(item => item.path !== project.path));

          render();

          if(trayPosition)
            tray.popUpContextMenu(null, trayPosition);
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

        store.set('projects', [...projects, {
          path,
          name,
        }]);

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
      type: 'normal',
      label: 'Fechar Code Tray',
      role: 'quit',
      enabled: true,
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', (event, boundaries, position) => {
    tray.popUpContextMenu();
    trayPosition = position;
  });
}

app.on('ready', () => {
  tray = new Tray(resolve(__dirname, 'assets', `icon${isWindows ? 'White' : ''}Template.png`));

  render();
});
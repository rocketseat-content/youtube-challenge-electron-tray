const { app, Tray, Menu, dialog } = require('electron');
const { spawn } = require('child_process');
const { resolve, basename } = require('path');
const Locale = require('../utils/locale');
const store = require('../utils/store');
const sort_by = require('../utils/sort');

// Init Store
store.create();
const locale = Locale.get();

module.exports = {
  tray    : null,
  projects: [],

  trayIcon: function () {
    this.tray = new Tray(resolve(__dirname, '..', '..', 'assets', 'iconTemplate.png'));
    this.projects = store.get('projects');
    this._setContext()
    this.tray.on('click', () => this.tray.popUpContextMenu(this._getContext()));

    return this.tray;
  },

  _setContext: function () {
    const context = Menu.buildFromTemplate([
      {label: locale.add, click: () => this._dialog()},
      {type: 'separator'},
      {label: locale.close, click: () => { app.quit() }}
    ])
    this.tray.setContextMenu(context)
  },

  _getContext: function () {
    this.projects = store.get('projects')

    let items = this.projects.map(el => ({
      label: el.name,
      submenu: [
        {
          label: locale.open,
          click: () => {spawn('code', [el.path], {shell: true})},
        },
        {
          label: locale.remove,
          click: () => {
            store.set('projects', this.projects.filter(item => item.path!==el.path));
            this._setContext()
          },
        },
      ]
    }))

    return Menu.buildFromTemplate([...items])
  },

  _dialog: async function () {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (!result) return;

    const [path] = result;
    const name = await basename(path);
    this.projects = [...this.projects, {path: '"' + path + '"', name}].sort(sort_by({name: 'name'}));

    store.set('projects', this.projects);
    this._setContext();
  }
}

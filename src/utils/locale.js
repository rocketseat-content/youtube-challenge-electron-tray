const { app }     = require('electron');
const { resolve } = require('path');
const fs          = require('fs');

module.exports = {
  get: function () {
    const locale = app.getLocale();
    console.log(locale)

    switch (locale) {
      case 'es-419' || 'es':
        return JSON.parse(fs.readFileSync(resolve(__dirname, '..', 'locale', 'es.json')))
      case 'pt-BR' || 'pt-PT':
        return JSON.parse(fs.readFileSync(resolve(__dirname, '..', 'locale', 'pt.json')))
      default:
        return JSON.parse(fs.readFileSync(resolve(__dirname, '..', 'locale', 'en.json')))
    }
  }
}

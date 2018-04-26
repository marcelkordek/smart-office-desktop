const {Menu,BrowserWindow} = require('electron')
const electron = require('electron')
const app = electron.app
const isDev = require('electron-is-dev');
const update = require('./updater');

const template = [{
  label: 'Ansicht',
  submenu: [{
    label: 'Neu laden',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close()
            }
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Vollbild umschalten',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    type: 'separator'
  }]
}, {
  label: 'Hilfe',
  role: 'help',
  submenu: [{
    label: 'Erfahren Sie mehr',
    click: function () {
      electron.shell.openExternal('http://electron.atom.io')
    }
  }]
}]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `Über ${name}`,
      role: 'about'
    },
    {
      label: 'Auf Update prüfen ',
      click(item, focusedWindow, event) { update.checkForUpdates(item, focusedWindow, event); }
    },{
      type: 'separator'
    }, {
      type: 'separator'
    }, {
      label: `${name} ausblenden`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Andere ausblenden',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Alle einblenden',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: `${name} beenden`,
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
  })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
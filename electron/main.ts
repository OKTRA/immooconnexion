import { app, BrowserWindow, ipcMain, Menu, Notification } from 'electron'
import { autoUpdater } from 'electron-updater'
import Store from 'electron-store'
import * as path from 'path'

// Configuration du store pour les données persistantes
const store = new Store()

// Configuration de l'auto-updater
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function createWindow() {
  console.log('Creating main window...')
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  // Menu natif
  const template = [
    {
      label: 'Fichier',
      submenu: [
        { role: 'quit', label: 'Quitter' }
      ]
    },
    {
      label: 'Edition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Charger l'application
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('Loading from dev server:', process.env.VITE_DEV_SERVER_URL)
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    console.log('Loading from file:', path.join(__dirname, '../dist/index.html'))
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Gestion des mises à jour
  autoUpdater.on('update-available', () => {
    new Notification({
      title: 'Mise à jour disponible',
      body: 'Une nouvelle version est disponible. Voulez-vous la télécharger ?'
    }).show()

    mainWindow.webContents.send('update-available')
  })

  autoUpdater.on('update-downloaded', () => {
    new Notification({
      title: 'Mise à jour prête',
      body: 'La mise à jour sera installée au prochain redémarrage.'
    }).show()

    mainWindow.webContents.send('update-downloaded')
  })

  // Vérifier les mises à jour toutes les heures
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60 * 60 * 1000)
}

// Gestion du mode hors-ligne
app.on('ready', () => {
  console.log('App is ready, creating window...')
  createWindow()

  // Vérifier la connexion internet
  const handleOffline = () => {
    new Notification({
      title: 'Mode hors-ligne',
      body: 'Vous êtes actuellement hors-ligne. Certaines fonctionnalités peuvent être limitées.'
    }).show()
  }

  const handleOnline = () => {
    new Notification({
      title: 'Connexion rétablie',
      body: 'Vous êtes de nouveau connecté à Internet.'
    }).show()
  }

  ipcMain.on('offline-status-changed', (_, status) => {
    if (status === 'offline') {
      handleOffline()
    } else {
      handleOnline()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC handlers pour la communication avec le renderer
ipcMain.handle('download-update', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.handle('quit-and-install', () => {
  autoUpdater.quitAndInstall()
})
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { autoUpdater } from 'electron-updater'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // En développement, on charge l'URL de dev
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080')
    win.webContents.openDevTools()
  } else {
    // En production, on charge le fichier HTML buildé
    win.loadFile(path.join(process.cwd(), 'dist/index.html'))
  }

  // Configuration de l'auto-updater
  autoUpdater.checkForUpdatesAndNotify()

  return win
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
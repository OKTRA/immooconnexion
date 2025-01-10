import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import Store from 'electron-store'

const store = new Store()

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // En développement, on charge l'URL de dev de Vite
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // En production, on charge le fichier HTML buildé
    win.loadFile(path.join(process.cwd(), 'dist/index.html'))
  }

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

// IPC handlers pour la synchronisation des données
ipcMain.handle('get-stored-data', async (_, key: string) => {
  return store.get(key)
})

ipcMain.handle('set-stored-data', async (_, key: string, value: any) => {
  store.set(key, value)
})
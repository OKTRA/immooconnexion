import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  // Gestion des mises à jour
  onUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on('update-available', callback)
  },
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', callback)
  },
  downloadUpdate: () => {
    return ipcRenderer.invoke('download-update')
  },
  quitAndInstall: () => {
    return ipcRenderer.invoke('quit-and-install')
  },
  
  // Gestion du mode hors-ligne
  notifyOfflineStatus: (status: 'online' | 'offline') => {
    ipcRenderer.send('offline-status-changed', status)
  }
})
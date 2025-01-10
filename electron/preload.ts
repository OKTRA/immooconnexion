import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getStoredData: (key: string) => ipcRenderer.invoke('get-stored-data', key),
  setStoredData: (key: string, value: any) => ipcRenderer.invoke('set-stored-data', key, value)
})
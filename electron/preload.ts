import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    electronAPI: {
      getStoredData: (key: string) => Promise<any>
      setStoredData: (key: string, value: any) => Promise<void>
    }
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  getStoredData: (key: string) => ipcRenderer.invoke('get-stored-data', key),
  setStoredData: (key: string, value: any) => ipcRenderer.invoke('set-stored-data', key, value)
})
import { contextBridge, ipcRenderer } from 'electron'

type BridgeState = {
  exclusiveAcquired: boolean
  virtualCameraActive: boolean
  lastMessage: string
}

const bridgeApi = {
  getState: (): Promise<BridgeState> => ipcRenderer.invoke('bridge:getState'),
  setExclusive: (acquire: boolean): Promise<BridgeState> =>
    ipcRenderer.invoke('bridge:setExclusive', acquire),
  setVirtualCamera: (active: boolean): Promise<BridgeState> =>
    ipcRenderer.invoke('bridge:setVirtualCamera', active)
}

contextBridge.exposeInMainWorld('bridgeApi', bridgeApi)

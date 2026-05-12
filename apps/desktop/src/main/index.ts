import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { createInitialBridgeState, type BridgeState } from '@nikon-uvc-ptp-bridge/core'
import { VIDEO_ADAPTER_NOTES, VIDEO_ADAPTER_STAGE } from '@nikon-uvc-ptp-bridge/video'

const base = createInitialBridgeState()
const bridgeState: BridgeState = {
  ...base,
  lastMessage: `${base.lastMessage} Video adapter: ${VIDEO_ADAPTER_STAGE}. ${VIDEO_ADAPTER_NOTES}`
}

let mainWindow: BrowserWindow | null = null

function resolvePreloadScript(): string {
  const dir = join(__dirname, '../preload')
  for (const name of ['index.js', 'index.mjs']) {
    const full = join(dir, name)
    if (existsSync(full)) {
      return full
    }
  }
  return join(dir, 'index.mjs')
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 820,
    show: false,
    autoHideMenuBar: true,
    title: 'Nikon UVC-PTP Bridge',
    webPreferences: {
      preload: resolvePreloadScript(),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
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

ipcMain.handle('bridge:getState', () => ({ ...bridgeState }))

ipcMain.handle('bridge:setExclusive', async (_event, acquire: boolean) => {
  bridgeState.exclusiveAcquired = Boolean(acquire)
  bridgeState.lastMessage = acquire
    ? 'Exclusive mode toggled on (stub). A future build will negotiate WinUSB or the still-image stack so Webcam Utility releases the device.'
    : 'Exclusive mode toggled off (stub).'
  return { ...bridgeState }
})

ipcMain.handle('bridge:setVirtualCamera', async (_event, active: boolean) => {
  bridgeState.virtualCameraActive = Boolean(active)
  bridgeState.lastMessage = active
    ? `Virtual camera path toggled on (stub). ${VIDEO_ADAPTER_NOTES}`
    : 'Virtual camera path toggled off (stub).'
  return { ...bridgeState }
})

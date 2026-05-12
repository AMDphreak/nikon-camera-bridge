/// <reference types="vite/client" />

export {}

type BridgeState = {
  exclusiveAcquired: boolean
  virtualCameraActive: boolean
  lastMessage: string
}

declare global {
  interface Window {
    bridgeApi: {
      getState: () => Promise<BridgeState>
      setExclusive: (acquire: boolean) => Promise<BridgeState>
      setVirtualCamera: (active: boolean) => Promise<BridgeState>
    }
  }
}

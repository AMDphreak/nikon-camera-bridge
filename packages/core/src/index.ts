export interface BridgeState {
  exclusiveAcquired: boolean
  virtualCameraActive: boolean
  lastMessage: string
}

/** Shown in the desktop shell until native USB and virtual camera wiring land. */
export const INITIAL_BRIDGE_MESSAGE =
  'Idle. Bridge core is wired; USB negotiation, MF virtual camera, and HTTP control are still stubs in this release.'

export function createInitialBridgeState(): BridgeState {
  return {
    exclusiveAcquired: false,
    virtualCameraActive: false,
    lastMessage: INITIAL_BRIDGE_MESSAGE
  }
}

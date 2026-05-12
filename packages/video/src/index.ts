/** Lifecycle stage for the MF virtual camera integration. */
export type VideoAdapterStage = 'planned' | 'experimental' | 'stable'

export const VIDEO_ADAPTER_STAGE: VideoAdapterStage = 'planned'

export const VIDEO_ADAPTER_NOTES =
  'Future: register a Media Foundation virtual camera source and pump frames from the bridge core. Native Node addon or sidecar process likely required.'

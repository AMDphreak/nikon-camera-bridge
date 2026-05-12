import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

const bundledWorkspace = ['@nikon-uvc-ptp-bridge/core', '@nikon-uvc-ptp-bridge/video']

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: bundledWorkspace })]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {}
})

import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

const bundledWorkspace = ['@nikon-camera-bridge/core', '@nikon-camera-bridge/video']

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: bundledWorkspace })]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {}
})

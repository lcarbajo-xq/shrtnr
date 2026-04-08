import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  //Support ts aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    // ...
  }
})

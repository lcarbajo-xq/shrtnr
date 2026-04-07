import { defineConfig } from 'vitest/config'

export default defineConfig({
  //Support ts aliases
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    // ...
  }
})

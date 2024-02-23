import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

const generateInputObject = (dir) => {
  const directoryPath = path.resolve(__dirname, dir)
  const components = fs.readdirSync(directoryPath)
  const input = {}
  components.forEach(file => {
    if (file.endsWith('.js')) {
      const name = file.replace('.js', '')
      input[name] = path.resolve(directoryPath, file)
    }
  })
  return input
}

const adminInput = generateInputObject('./src/components/admin')

export default defineConfig({
  build: {
    outDir: 'src/bundles/admin',
    assetsDir: '.',
    rollupOptions: {
      input: {
        ...adminInput
      }
    },
    minify: 'terser'
  }
})

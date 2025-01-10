import { build } from 'electron-builder'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

build({
  config: {
    appId: 'com.oktra.immoo',
    productName: 'Immoo',
    directories: {
      output: path.join(process.cwd(), 'release'),
    },
    publish: {
      provider: 'github',
      owner: 'OKTRA',
      repo: 'immoo',
      private: false,
      releaseType: 'release',
      tag: 'V1.0.0'
    },
    mac: {
      category: 'public.app-category.business',
      target: ['dmg', 'zip']
    },
    win: {
      target: ['nsis', 'portable']
    },
    linux: {
      target: ['AppImage', 'deb']
    }
  }
})
.then(() => console.log('Build completed successfully'))
.catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
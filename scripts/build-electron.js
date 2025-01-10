import { build } from 'electron-builder'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

await build({
  config: {
    appId: 'com.oktra.immoo',
    productName: 'Immoo',
    directories: {
      output: path.join(rootDir, 'release'),
      buildResources: path.join(rootDir, 'public')
    },
    files: [
      'dist/**/*',
      'electron/**/*'
    ],
    mac: {
      category: 'public.app-category.business',
      target: ['dmg', 'zip'],
      icon: path.join(rootDir, 'public/favicon.ico')
    },
    win: {
      target: ['nsis', 'portable'],
      icon: path.join(rootDir, 'public/favicon.ico')
    },
    linux: {
      target: ['AppImage', 'deb'],
      icon: path.join(rootDir, 'public/favicon.ico')
    },
    publish: {
      provider: 'github',
      owner: 'OKTRA',
      repo: 'immoo',
      private: false,
      releaseType: 'release'
    }
  }
})
.then(() => console.log('Build completed successfully'))
.catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
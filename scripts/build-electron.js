import { build } from 'electron-builder'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

console.log('Starting Electron build process...')

await build({
  config: {
    directories: {
      output: path.join(rootDir, 'dist/electron'),
      buildResources: path.join(rootDir, 'build')
    },
    files: [
      'dist/**/*',
      'electron/**/*'
    ],
    extraMetadata: {
      main: 'electron/main.js'
    },
    mac: {
      category: 'public.app-category.business',
      target: ['dmg', 'zip'],
      icon: path.join(rootDir, 'public/favicon.ico'),
      hardenedRuntime: true,
      gatekeeperAssess: false,
      entitlements: 'build/entitlements.mac.plist',
      entitlementsInherit: 'build/entitlements.mac.plist'
    },
    win: {
      target: ['nsis', 'portable'],
      icon: path.join(rootDir, 'public/favicon.ico')
    },
    linux: {
      target: ['AppImage', 'deb'],
      icon: path.join(rootDir, 'public/favicon.ico')
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
      shortcutName: 'Immoov'
    },
    publish: {
      provider: 'github',
      private: false,
      releaseType: 'release'
    }
  }
})
.then(() => {
  console.log('Build completed successfully')
})
.catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
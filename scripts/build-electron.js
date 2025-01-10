import { build } from 'electron-builder'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

build({
  config: {
    appId: 'com.lovable.app',
    productName: 'Lovable',
    directories: {
      output: path.join(process.cwd(), 'release'),
    },
    publish: {
      provider: 'github',
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY_NAME,
      private: false,
      releaseType: 'release'
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
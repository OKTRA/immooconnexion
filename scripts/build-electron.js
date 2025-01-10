const builder = require('electron-builder')
const path = require('path')

builder.build({
  config: {
    appId: 'com.immoov.app',
    productName: 'Immoov',
    directories: {
      output: path.join(process.cwd(), 'release'),
    },
    publish: {
      provider: 'github',
      owner: process.env.GITHUB_REPOSITORY_OWNER,
      repo: process.env.GITHUB_REPOSITORY_NAME,
      private: true,
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
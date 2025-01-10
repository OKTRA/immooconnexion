const { build } = require('electron-builder')
const path = require('path')

build({
  config: {
    directories: {
      output: path.join(process.cwd(), 'release'),
    },
    publish: 'never'
  },
})
  .then(() => console.log('Build completed successfully'))
  .catch((error) => {
    console.error('Build failed:', error)
    process.exit(1)
  })
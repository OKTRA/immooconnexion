const builder = require('electron-builder')
const path = require('path')

builder.build({
  config: {
    directories: {
      output: path.join(process.cwd(), 'release'),
    },
    publish: process.env.GH_TOKEN ? 'always' : 'never'
  },
})
.then(() => console.log('Build completed successfully'))
.catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
const { build } = require('electron-builder')
const path = require('path')

build({
  config: {
    directories: {
      output: path.join(process.cwd(), 'release'),
    },
  },
})
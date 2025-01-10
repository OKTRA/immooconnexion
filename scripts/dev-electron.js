const { spawn } = require('child_process')
const { build } = require('vite')
const electron = require('electron')
const path = require('path')

async function startElectron() {
  const process = spawn(electron, ['.'], { stdio: 'inherit' })
  process.on('close', () => {
    process.kill(0)
    process.exit()
  })
}

async function watchMain() {
  await build({
    configFile: 'vite.config.ts',
    build: {
      watch: {},
    },
  })
  startElectron()
}

watchMain()
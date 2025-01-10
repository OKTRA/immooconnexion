const { spawn } = require('child_process')
const { build } = require('vite')
const electron = require('electron')
const path = require('path')

async function startElectron() {
  const electronPath = path.join(process.cwd(), '.')
  const process = spawn(electron, [electronPath], { 
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_START_URL: 'http://localhost:8080'
    }
  })
  
  process.on('close', () => {
    process.kill(0)
    process.exit()
  })
}

async function watchMain() {
  try {
    await build({
      configFile: 'vite.config.ts',
      mode: 'development',
      build: {
        watch: {},
      },
    })
    startElectron()
  } catch (err) {
    console.error('Error during build:', err)
    process.exit(1)
  }
}

watchMain()
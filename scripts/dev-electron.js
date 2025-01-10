const { spawn } = require('child_process')
const { build } = require('vite')
const electron = require('electron')
const path = require('path')

async function startElectron() {
  const electronPath = path.join(__dirname, '..')
  console.log('Starting Electron process from:', electronPath)
  
  const process = spawn(electron, ['.'], { 
    stdio: 'inherit',
    cwd: electronPath,
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: 'http://localhost:8080',
      NODE_ENV: 'development'
    }
  })
  
  process.on('close', () => {
    console.log('Electron process terminated')
    process.exit()
  })
}

async function watchMain() {
  try {
    console.log('Building and watching for changes...')
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

console.log('Starting development environment...')
watchMain()
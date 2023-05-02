const fs = require('fs')
const { exec } = require('child_process')

const main = () => {
  console.log('reading lerna packages!')

  exec('ls', (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
    if (error !== null) {
      console.log(`exec error: ${error}`)
    }
  })

  fs.readFile(
    './lerna-publish-summary.json',
    { encoding: 'utf8' },
    (content) => {
      console.log(content)
    },
  )
}

main()

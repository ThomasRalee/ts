const fs = require('fs')

const main = () => {
  console.log('reading lerna packages!')

  fs.readFile(
    './lerna-publish-summary.json',
    { encoding: 'utf8' },
    (content) => {
      console.log(content)
    },
  )
}

main()

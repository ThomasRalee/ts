const fs = require('fs')

const main = () => {
  console.log('reading lerna packages!')

  const content = fs.readFileSync('./lerna-publish-summary.json', {
    encoding: 'utf8',
  })

  console.log(content)
}

main()

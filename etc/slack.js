const fs = require('fs')
const https = require('node:https')

function getActor() {
  const actor = process.argv.find((arg) => arg.startsWith('--actor'))

  console.log(process.argv)
  console.log({ actor })
}

function getPublishedMessage() {
  const commitMessageIndex = process.argv.find((arg) =>
    arg.startsWith('--commit-message'),
  )

  if (commitMessageIndex > 0) {
    return 'Published packages:'
  }

  return `Published packages: ${process.argv
    .slice(commitMessageIndex)
    .join('')}`
}

function getSlackAPI() {
  const apiValue = process.argv.find((arg) => arg.startsWith('--api='))

  if (!apiValue) {
    return
  }

  return apiValue.split('=').pop()
}

function formatPublishedItem({ packageName, version }) {
  return {
    type: 'rich_text_section',
    elements: [
      {
        type: 'text',
        text: `${packageName}: ${version}`,
      },
    ],
  }
}

function sendSlackMessage(webhookURL, publishedItems) {
  const messageBody = JSON.stringify({
    text: 'Published packages',
    blocks: [
      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_section',
            elements: [
              {
                type: 'text',
                text: getPublishedMessage(),
                style: {
                  bold: true,
                },
              },
            ],
          },
          getActor() ? undefined : undefined,
          {
            type: 'rich_text_list',
            elements: publishedItems,
            style: 'bullet',
            indent: 0,
          },
        ],
      },
    ],
  })

  return new Promise((reject) => {
    const requestOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(webhookURL, requestOptions)

    req.on('error', (e) => {
      reject(e)
    })

    req.write(messageBody)
    req.end()
  })
}

const main = async () => {
  let publishedItems = []

  const api = getSlackAPI()

  if (!api) {
    console.error('missing slack api endpoint')

    return
  }

  try {
    const content = JSON.parse(
      fs.readFileSync('./lerna-publish-summary.json', {
        encoding: 'utf8',
      }),
    )

    publishedItems = content.map(formatPublishedItem)

    if (!publishedItems || publishedItems.length === 0) {
      return
    }
  } catch (e) {
    console.error('Error reading the latest published packages')
    console.error(e.message)

    return
  }

  try {
    sendSlackMessage(api, publishedItems).then(() =>
      console.log('Broadcast packages to slack'),
    )
  } catch (e) {
    console.error('There was a error with the request', e)
  }
}

main()

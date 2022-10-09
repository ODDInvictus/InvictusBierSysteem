const fs = require('fs')

const fileContent = fs.readFileSync('config.json', 'utf8')
const config = JSON.parse(fileContent)

config.cicd.build.details.buildDate = new Date().getTime() / 1000
config.cicd.build.details.branch = process.env.DRONE_BRANCH
config.cicd.build.details.buildNumber = process.env.DRONE_BUILD_NUMBER
config.cicd.build.details.commitLink = process.env.DRONE_COMMIT_LINK
config.cicd.build.details.commit = process.env.DRONE_COMMIT
config.cicd.build.details.gitUrl = process.env.DRONE_GIT_HTTP_URL

fs.writeFileSync('config.json', JSON.stringify(config, null, 2))
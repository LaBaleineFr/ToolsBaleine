# Discord Bot Starter in Node.JS

## Features
- ...

## Prerequisites
#### Optimize for VSCode
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org) & [npm](https://www.npmjs.com/)
- [Yarn](https://yarnpkg.com)

### Setup (before anything else)
```bash
$ yarn install
# You also need to set some vars in .env file, you could also use export
$ echo "DISCORD_TOKEN={YOUR_MAGIC_TOKEN}" > .env
$ echo "DISCORD_CHAN_ID={YOUR_MAGIC_TOKEN}" > .env #Default post channel id
$ echo "DISCORD_CMD_CHAN_ID={YOUR_MAGIC_TOKEN}" > .env #Default control channel id
```

### Build
```bash
$ yarn build #or run Build Task in VSCode
```

### ESLint
```bash
$ yarn lint
```

### Launch in Dev (w/ nodemon)
```bash
$ yarn start #build automatically before starting
```

<!--### Test
```bash
$ yarn test #or run Test Task in VSCode
```-->
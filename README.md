# Backend menual
## Install
1. install node
2. install package
```cmd
npm install
```

## Project structure
```javascript
├ bin
│   └ www.js // start point
├ model
├ router
├ app.js // express.js setting
└ preload.js // run before http server run


├│└
```
## Storage path
If you want to change directory, than write STORAGE_PATH={{wanna be path}} to .env file (default = './workflow-storage')
### Storage structure
```
├│└
```

## Environment
Using dotenv that set port and storage path


## Run server
### Product
Run project babel-node
```
npm start
```
### Development
Run project to nodemon.js
```
npm run dev
```
### Test
Testing with jest
```
npm test
```

# Repository manage
backend directory managed by `git subtree`  
origin URL - https://github.com/Seokkyu-Yoon/sky-workflow-engine
```
git remote sky-github-subtree git@github.com:Seokkyu-Yoon/sky-workflow-engine.git
```

1. pull request
```
git subtree pull --prefix backend sky-github-subtree master
```
2. push request
```
git subtree push --prefix backend sky-github-subtree master
```
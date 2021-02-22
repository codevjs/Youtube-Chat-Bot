# Youtube Live Stream Chat Bot

This is project for scraping youtube live stream chat. It is bootstrapped with [Create React App](https://github.com/facebook/create-react-app) & [puppeteer](https://developers.google.com/web/tools/puppeteer). 

## Get Started
#### Set up the development environment
You need to set up your development environment before you can do anything.
Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

Install yarn globally

```bash
yarn global add yarn
```

## Install
- Install all dependencies with
```sh
yarn install
```
or
```sh
npm install
```

## How to run
- Clone the repository using HTTPS 
```sh
git clone https://github.com/codevjs/Youtube-Chat-Bot.git <folder name>
```

#### In the Client directory
- Running in dev mode
```sh
yarn start
```
Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

- Running in production mode
```sh
yarn production
```
The server address will be displayed to you as http://localhost:8080

#### In the Server directory, you can run:
```sh
node index.js "<youtube live chat url>"
```

Project of Single Page Application with SASS, no JS framework (only DOM manipulation) and use Google Books API.

Two main features:
- finding and adding a book to its list;
- viewing books and deleting a book.

# Prerequisite

Installation of npm and Node.js.

Follow the installation procedures on this page:
[download page](https://nodejs.org/en/download/)

To see if you already have Node.js and npm installed and check the installed version, run the following commands:
```
node -v
npm -v
```


# Installation

Launch this command to install all dependencies:
```
npm install
```

# Usage

## local server

To run the website in a static HTTP server, run this command:
```
npm run dev
```
and go to this url http://127.0.0.1:8080/ to see the website.


Press Ctrl-C to stop local server.

***

# Development

## sass

Install sass:
```
npm install -g sass
```

If you modify scss file, you need to compile to update css file with this command:
```
npm run sass
```
Press Ctrl-C to stop process.

## eslint

If you modify js file, run this command to check that the code uses the JS standards: 
```
npm run lint
```


***
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

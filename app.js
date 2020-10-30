const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const {google} = require('googleapis');
const http = require('http');
const opn = require('open');
const destroyer = require('server-destroy');
const url = require('url');


const pathDirectory = path.join(__dirname + "/src");

// console.log(pathDirectory);
app.use(express.static(pathDirectory));

app.listen(3000, () => {
  console.log('Server is running.')
})
